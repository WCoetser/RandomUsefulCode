using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ImageAsNumber {
    
    /// <summary>
    /// Warning: Extreme inefficiency ... do not use in production system
    /// </summary>
    public static class ImageExtractor {

        const int IMG_START_OFFSET = 0x0A;

        /// <summary>
        /// Convert image to byte[]
        /// </summary>
        public static byte[] GetImageAsRaw(Image img) {
            using (Bitmap b = new Bitmap(img)) {
                // Convert image to desired format
                byte[] dataOut = new byte[img.Width * img.Height * 3];
                int address = 0;
                for (int x = 0; x < img.Width; x++) {
                    for (int y = 0; y < img.Height; y++) {
                        var p = b.GetPixel(x, y);
                        dataOut[address++] = p.R;
                        dataOut[address++] = p.G;
                        dataOut[address++] = p.B;
                    }
                }
                return dataOut;
            }
        }
        
        /// <summary>
        /// Convert byte[] to image. Format must be 24 bit RGB.
        /// </summary>
        public static Image GetRawAsImage(int width, int height, byte[] imageData) {
            if (imageData.Length != (width * height * 3)) {
                throw new ArgumentException("Invalid image data.");
            }
            Bitmap bmpOut = new Bitmap(width, height);
            int address = 0;
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    bmpOut.SetPixel(x,y, Color.FromArgb(imageData[address], imageData[address+1], imageData[address+2]));
                    address += 3;
                }
            }
            return bmpOut;
        }

    }
}
