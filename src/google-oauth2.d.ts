/**
 * Definition file for the node.js module
 *
 */
interface GoogleOAuth2Options{
    clientId: string
    redirectUri?: string;
    scope?: string | string[];
    popupHeight:number;
    popupWidth:number;
}
declare class GoogleOAuth2{
    constructor(options:GoogleOAuth2Options);
    public onlogout:()=>void;
    public onlogin:()=>void;
    getAccessToken();
    login(approvalPrompt?:boolean, immediate?:boolean);
    logout();
    destory();

}
declare module "google-oauth2-web-client"{
    export = GoogleOAuth2
}