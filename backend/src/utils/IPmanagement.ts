// utils/ipTracker.js

class IpTracker {
    private static instance: IpTracker;
    private ipArray: Array<{  ip:string;used:number }>
    private constructor() {
  
      this.ipArray = []; 
    }
    public static getInstance(): IpTracker {
        if (!IpTracker.instance) {
            IpTracker.instance = new IpTracker();

        }
        return IpTracker.instance;
        }
    public addIp(ip:{ip:string,used:number}):void {
      if (!this.ipArray.find(value=>value.ip===ip.ip)) {
        this.ipArray.push(ip);
      }
    }
  
    getIpCount() {
      return this.ipArray.length;
    }
    checkIp(ip:string):{ip:string,used:number}|undefined {
        return this.ipArray.find(value=>value.ip===ip)
        }
    _clearIps() {
      this.ipArray = [];
    }
    addUsed(ip:string,used:number):void {
        const ipIndex = this.ipArray.findIndex(value=>value.ip===ip)
        if(ipIndex>=0){
            this.ipArray[ipIndex].used+=used
        }
    }
  }
  
export const ipManagement = IpTracker.getInstance();
  