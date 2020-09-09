import React from "react";
import { StyleSheet, Linking } from "react-native";
import WebView, { WebViewNavigation } from "react-native-webview";

type Props = {
    webKakaoKey: string;
    whitelistedDomain: string;
    onShareFailure?: () => void;
};
export type LinkObject = {
    webUrl?: string;
    mobileWebUrl?: string;
    androidExecParams?: string;
    iosExecParams?: string;
};
export type DefaultTemplate = {
    objectType: "text";
    text: string; // max-len 200
    link: LinkObject;
    buttonTitle?: string;
    buttons?: Array<{ title: string; link: LinkObject }>; // buttonTitle 과 buttons 함께 있을 경우 buttons 가 적용됨
    callback?: () => void; //카카오링크 웹공유에서 공유 버튼 클릭 시 호출되는 콜백 함수 (IE 제외)
    serverCallbackArgs?: object | string; // 카카오링크 공유 시 전송되는 링크 콜백에 포함되는 파라미터.
};
export type CustomTemplate = {
    templateId: number;
    templateArgs?: Record<string, string>;
    installTalk?: boolean;
};

export default class KakaoLink extends React.PureComponent<Props> {
    private webview = React.createRef<WebView>();
    private get source() {
        return {
            baseUrl: this.props.whitelistedDomain,
            html: `
<html>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
    <script>
        window.Kakao.init("${this.props.webKakaoKey}");
    </script>
</html>`
        };
    }

    public sendDefault = (template?: DefaultTemplate) => {
        const script = `window.Kakao.Link.sendDefault(${JSON.stringify(template)}); true;`;
        this.webview.current?.injectJavaScript(script);
    };
    public sendCustom = (template: CustomTemplate) => {
        const script = `window.Kakao.Link.sendCustom(${JSON.stringify(template)}); true;`;
        this.webview.current?.injectJavaScript(script);
    };
    private handleScheme = ({ url }: WebViewNavigation) => {
        const link = url.startsWith("intent:") ? url.replace("intent:", "") : url;
        if (link.startsWith("kakaolink://")) {
            Linking.openURL(link).catch(this.props.onShareFailure);
            return false;
        }
        return true;
    };
    render() {
        return (
            <WebView
                originWhitelist={["*"]}
                onShouldStartLoadWithRequest={this.handleScheme}
                style={styles.webview}
                ref={this.webview}
                allowsInlineMediaPlayback={false}
                source={this.source}
            />
        );
    }
}

const styles = StyleSheet.create({
    webview: { flex: 0, width: 0, height: 0, opacity: 0 }
});
