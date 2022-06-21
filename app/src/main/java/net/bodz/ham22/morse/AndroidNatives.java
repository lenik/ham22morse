package net.bodz.ham22.morse;

import android.content.Context;
import android.net.DhcpInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import java.math.BigInteger;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.nio.ByteOrder;

public class AndroidNatives {

    Context context;

    public AndroidNatives(Context context) {
        this.context = context;
    }

    @JavascriptInterface
    public void showToast(String toast) {
        Toast.makeText(context, toast, Toast.LENGTH_SHORT).show();
    }

    @JavascriptInterface
    public String getWifiIp() {
        WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        WifiInfo wifiInfo = wifiManager.getConnectionInfo();
        int ipAddress = wifiInfo.getIpAddress();

        byte[] ip = int32ToByteArray(ipAddress);
        String ipStr = null;
        if (ip.length == 4)
            try {
                ipStr = InetAddress.getByAddress(ip).getHostAddress();
            } catch (UnknownHostException ex) {
                Log.e("WIFIIP", "Unable to get host address.");
            }

        String gatewayStr = null;
        DhcpInfo dhcpInfo = wifiManager.getDhcpInfo();
        if (dhcpInfo != null) {
            byte[] gateway = int32ToByteArray(dhcpInfo.gateway);
            if (gateway.length == 4)
                try {
                    gatewayStr = InetAddress.getByAddress(gateway).getHostAddress();
                } catch (UnknownHostException ex) {
                    Log.e("WIFIIP", "Unable to get host address.");
                }
        }

        return "{ \"ip\": " + strForm(ipStr) +
                ", \"gateway\": " + strForm(gatewayStr) +
                " }";
    }

    static boolean reversed = ByteOrder.nativeOrder().equals(ByteOrder.LITTLE_ENDIAN);

    static byte[] int32ToByteArray(int n) {
        if (reversed)
            n = Integer.reverseBytes(n);
        return BigInteger.valueOf(n).toByteArray();
    }

    static String strForm(String s) {
        if (s == null)
            return "null";
        else
            return '"' + s + '"';
    }

}
