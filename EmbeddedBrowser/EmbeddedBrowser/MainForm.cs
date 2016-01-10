using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EmbeddedBrowser
{
  public partial class MainForm : Form
  {
    public MainForm()
    {
      InitializeComponent();
    }

    private void MainFormLoad(object sender, EventArgs e)
    {

      // Set adapter for communication
      webBrowser1.ObjectForScripting = new JavaScriptToCSharpAdapter { Parent = this, Browser = webBrowser1 };

      webBrowser1.DocumentText =
           "<html><head><script>" +
           "function test(message) { alert(message); }" +
           "</script></head><body><button " +
           "onclick=\"window.external.ReceiveMesage('testing 123')\">" +
           "call client code from script code</button>" +
           "</body></html>";

      //webBrowser1.Url = new Uri("http://www.coffee-smudge.com/PS4Test/");
      //webBrowser1.Url = new Uri("https://get.webgl.org/"); // IE 11 feature
      //webBrowser1.Url = new Uri("https://globe.chromeexperiments.com/");
    }
  }
}
