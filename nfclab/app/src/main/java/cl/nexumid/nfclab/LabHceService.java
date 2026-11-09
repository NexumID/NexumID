package cl.nexumid.nfclab;
import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
/** Responde solamente al AID de laboratorio. No copia UID ni credenciales físicas. */
public class LabHceService extends HostApduService {
  private static final byte[] AID = {(byte)0xF0,1,2,3,4,5,6};
  @Override public byte[] processCommandApdu(byte[] command, Bundle extras) {
    if (command != null && command.length >= 12 && command[0]==0x00 &&
        (command[1]&0xff)==0xA4 && command[2]==0x04 && command[3]==0x00 &&
        (command[4]&0xff)==AID.length &&
        Arrays.equals(Arrays.copyOfRange(command,5,12),AID)) {
      byte[] message = "NEXUMID-LAB".getBytes(StandardCharsets.US_ASCII);
      byte[] reply = Arrays.copyOf(message, message.length+2);
      reply[reply.length-2]=(byte)0x90; reply[reply.length-1]=0x00;
      return reply;
    }
    return new byte[]{(byte)0x6A,(byte)0x82};
  }
  @Override public void onDeactivated(int reason){}
}
