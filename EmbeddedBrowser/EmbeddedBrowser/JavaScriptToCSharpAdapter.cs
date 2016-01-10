using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EmbeddedBrowser
{
  [ComVisible(true)]  
  public class JavaScriptToCSharpAdapter
  {
    public Form Parent;
    public WebBrowser Browser;

    public void ReceiveMesage(string message) 
    {
      MessageBox.Show(Parent, message);
      SendMessage("testing 456");
    }

    public void SendMessage(string message) 
    {
      Browser.Document.InvokeScript("test",
             new String[] { message });
    }
  }
}
