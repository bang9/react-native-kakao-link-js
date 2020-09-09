# react-native-kakao-link-js

-   네이티브 의존성 없이, 카카오 링크를 사용하기 위한 모듈입니다. (웹뷰를 통해 자바스크립트 SDK 를 사용합니다.)
-   kakao link for react native without native dependency (except webview!)

### Installation

1. `yarn add react-native-kakao-link-js`

2-1. `yarn add react-native-webview`

2-2. `cd ios && pod install` or `npx pod-install`

### Feature

-   [sendDefault](https://developers.kakao.com/sdk/reference/js/release/Kakao.Link.html#.sendDefault)
-   [sendCustom](https://developers.kakao.com/sdk/reference/js/release/Kakao.Link.html#.sendCustom)

### Props

-   whitelistedDomain(필수): 카카오 앱에 등록된 도메인
-   webKakaoKey(필수): 웹용 카카오 앱 키
-   onShareFailure(옵션): 카카오 링크 동작에 실패한 경우 트리거됩니다.

### Example

```tsx
const ShareButton = () => {
    const kakaoLink = React.useRef<KakaoLink>();
    const shareKakao = () => {
        kakaoLink.current?.sendCustom({
            templateId: 12345,
            templateArgs: {
                title: "your custom arguments",
                body: "your custom arguments"
            }
        });
    };
    const onShareFailure = () => {
        // 카카오톡 설치가 안된 경우
        Alert.alert("알림", "카카오 공유하기에 실패했습니다.");
    };

    return (
        <TouchableOpacity onPress={shareKakao}>
            <Text>Share</Text>
            <KakaoLink
                ref={kakaoLink}
                whitelistedDomain={"https://domain.whitelisted.com"}
                webKakaoKey={"your-web-app-key"}
                onShareFailure={onShareFailure}
            />
        </TouchableOpacity>
    );
};
```
