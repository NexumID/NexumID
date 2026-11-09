package cl.nexumid.nfclab;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.MifareClassic;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import java.util.Arrays;
public class MainActivity extends Activity implements NfcAdapter.ReaderCallback {
  final int bg=Color.rgb(6,13,24),panel=Color.rgb(17,30,47),white=Color.rgb(235,246,255),
      accent=Color.rgb(53,183,255),muted=Color.rgb(154,177,198);
  NfcAdapter nfc; TextView status,result; Button start; boolean scanning=false;
  GradientDrawable backdrop(int color,int radius){
    GradientDrawable d=new GradientDrawable();d.setColor(color);d.setCornerRadius(radius);return d;
  }
  TextView txt(String value,int size,int color,boolean bold) {
    TextView t=new TextView(this);t.setText(value);t.setTextSize(size);t.setTextColor(color);
    t.setPadding(0,0,0,14);if(bold)t.setTypeface(null,Typeface.BOLD);return t;
  }
  TextView block(String value) {
    TextView t=txt(value,15,white,false);t.setPadding(24,22,24,22);
    t.setBackground(backdrop(panel,20));return t;
  }
  void add(LinearLayout c,View v){c.addView(v,new LinearLayout.LayoutParams(-1,-2));}
  @Override public void onCreate(Bundle b){
    super.onCreate(b);nfc=NfcAdapter.getDefaultAdapter(this);
    ScrollView scroll=new ScrollView(this);scroll.setFillViewport(true);scroll.setBackgroundColor(bg);
    LinearLayout c=new LinearLayout(this);c.setOrientation(1);c.setPadding(30,48,30,45);
    scroll.addView(c);setContentView(scroll);
    add(c,txt("NEXUMID / NFC LAB",26,white,true));
    add(c,txt("Diagnóstico NFC para Android · v0.1.1",15,muted,false));
    add(c,txt("CAPACIDADES",13,accent,true));
    status=block("Analizando teléfono...");add(c,status);
    add(c,txt(" ",12,muted,false));
    start=new Button(this);start.setText("Activar lectura NFC");start.setAllCaps(false);
    start.setTextColor(bg);start.setTypeface(null,Typeface.BOLD);start.setTextSize(16);
    start.setBackground(backdrop(accent,18));add(c,start);
    add(c,txt(" ",12,muted,false));
    add(c,txt("LECTURA DE TARJETA",13,accent,true));
    result=block("Pulsa el botón y acerca una tarjeta NFC. El identificador se ocultará.");
    add(c,result);
    start.setOnClickListener(v->toggleScan());
    add(c,txt(" ",12,muted,false));
    add(c,txt("EMULACIÓN DE LABORATORIO",13,accent,true));
    add(c,block("Incluye HCE ISO-DEP con AID F0010203040506, para un lector de pruebas configurado para reconocerlo. NO reproduce tarjetas MIFARE Classic, no copia códigos de acceso y no abre puertas Hikvision."));
    add(c,txt(" ",12,muted,false));
    add(c,txt("Sin Internet. No guarda datos personales ni claves.",12,muted,false));
    refresh();
  }
  void refresh(){
    boolean has=getPackageManager().hasSystemFeature(PackageManager.FEATURE_NFC);
    boolean hce=getPackageManager().hasSystemFeature(PackageManager.FEATURE_NFC_HOST_CARD_EMULATION);
    status.setText("Chip NFC: "+(has?"Disponible":"No disponible")
      +"\nNFC activado: "+(nfc!=null && nfc.isEnabled()?"Sí":"No")
      +"\nHCE ISO-DEP: "+(hce?"Disponible":"No disponible")
      +"\nEmulación MIFARE Classic: no compatible con HCE estándar");
  }
  void toggleScan(){
    if(nfc==null){status.setText("El teléfono no tiene chip NFC.");return;}
    if(!nfc.isEnabled()){startActivity(new Intent(Settings.ACTION_NFC_SETTINGS));return;}
    scanning=!scanning;
    if(scanning){
      nfc.enableReaderMode(this,this,NfcAdapter.FLAG_READER_NFC_A|
          NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK,null);
      start.setText("Detener lectura");
      result.setText("Lectura activa: acerca la tarjeta detrás del teléfono.");
    }else{
      nfc.disableReaderMode(this);start.setText("Activar lectura NFC");
      result.setText("Lectura detenida.");
    }
  }
  @Override protected void onResume(){super.onResume();if(status!=null)refresh();
    if(scanning && nfc!=null && nfc.isEnabled()){
      nfc.enableReaderMode(this,this,NfcAdapter.FLAG_READER_NFC_A|
          NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK,null);
    }}
  @Override protected void onPause(){
    if(nfc!=null&&scanning)nfc.disableReaderMode(this);super.onPause();
  }
  @Override public void onTagDiscovered(Tag tag){
    MifareClassic mc=MifareClassic.get(tag);
    String kind="Otra tarjeta NFC",detail="";
    if(mc!=null){
      kind="MIFARE Classic";
      detail="\nMemoria: "+mc.getSize()+" bytes\nSectores: "+mc.getSectorCount()
        +"\nBloques: "+mc.getBlockCount();
    }
    byte[] id=tag.getId();
    String technologies=Arrays.toString(tag.getTechList()).replace("android.nfc.tech.","");
    String message="Tipo: "+kind+detail+"\nUID: "+(id==null?"No disponible":id.length+" bytes (oculto)")
      +"\nTecnologías: "+technologies+
      "\n\nInformación pública detectada. No se autenticaron sectores ni copiaron credenciales.";
    runOnUiThread(()->result.setText(message));
  }
}
