using GMP;
using ObjectLifeCycleManagement;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ImageAsNumber {
    class Program {        

        static void Main(string[] args) {

            using (new DisposeContext()) {
            
                // Lhs                
                var img = Image.FromFile(@"C:\Downloads\Mountains\mountains_landscapes_fields_california_meadows_blue_flowers_wildflowers_1920x1080_26083.jpg");
                var raw = ImageExtractor.GetImageAsRaw(img);                
                var lhs = new GmpInteger(raw);

                // Rhs
                var img2 = Image.FromFile(@"C:\Downloads\Mountains\Edged-Mountains-landscape-mountain-1920x1080.jpg");
                var raw2 = ImageExtractor.GetImageAsRaw(img2);
                var rhs = new GmpInteger(raw2);

                var combined = (lhs + rhs) / new GmpInteger("2");
                bool isNegative = false;
                byte[] output = null;
                combined.Export(out output, out isNegative);
                
                var imgOut = ImageExtractor.GetRawAsImage(img.Width, img.Height, output);
                imgOut.Save("fout.bmp", ImageFormat.Bmp);
            }
        }
    }
}
