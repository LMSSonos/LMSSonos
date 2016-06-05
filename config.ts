/// configuration file
export class Config
{
    // this is the local IP the bridge binds to and LMS will connect to this IP
    public static LocalIPToBind : string = "192.168.178.100";
    // this is the local PORT the bridge binds to and LMS will connect to this PORT
    public static LocalPortToBind : number = 8080;
    // this is the URL of your LMS, the bridge makes the RPC calls to this URL
    public static LMSUrl : string = "http://192.168.178.102:9002";               
}
