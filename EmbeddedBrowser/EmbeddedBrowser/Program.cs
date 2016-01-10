using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace EmbeddedBrowser
{
  static class Program
  {
    /// <summary>
    /// The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main()
    {
      //http://weblog.west-wind.com/posts/2011/May/21/Web-Browser-Control-Specifying-the-IE-Version

      //string appName = (new FileInfo(Application.ExecutablePath)).Name;
      string appName = System.AppDomain.CurrentDomain.FriendlyName;

      if (MessageBox.Show("Set registry key?", "Question", MessageBoxButtons.YesNo) == DialogResult.Yes)
      {

        // For OS with WOW emulation
        try
        {
          RegistryKey key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\Internet Explorer\Main\FeatureControl\FEATURE_BROWSER_EMULATION");
          key.SetValue(appName, 0, RegistryValueKind.DWord);
          key.Close();
        }
        catch (UnauthorizedAccessException)
        {
          MessageBox.Show("Run as administrator ...");
          return;
        }
        catch (Exception ex)
        {
          Trace.WriteLine("WOW emulation: " + ex.Message);
        }

        try
        {
          // For OS without
          RegistryKey key = Registry.LocalMachine.CreateSubKey(@"HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Internet Explorer\MAIN\FeatureControl\FEATURE_BROWSER_EMULATION");
          key.SetValue(appName, 0, RegistryValueKind.DWord);
          key.Close();
        }
        catch (UnauthorizedAccessException)
        {
          MessageBox.Show("Run as administrator ...");
          return;
        }
        catch (Exception ex)
        {
          Trace.WriteLine("No WOW emulation: " + ex.Message);
        }
      }
      else MessageBox.Show("Browser version not set to latest, may run in \"Legacy Mode\" (ex. IE 7)");

      Application.EnableVisualStyles();
      Application.SetCompatibleTextRenderingDefault(false);
      Application.Run(new MainForm());
    }
  }
}
