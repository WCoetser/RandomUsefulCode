/* Licence: GPL version 3, Wikus Coetser, 2013, see http://www.gnu.org/licenses/gpl-3.0.html */

/*
  Class for managing textures. glTexture = the texture to bind to. Support 32 textures for now.
*/
Texture = function (imgTexSrc, glContext) {
  this.gl = glContext;
  this.glTexture = this.gl.createTexture();
  this.image = imgTexSrc;
  this.textureName = Texture.CurrentName;
  Texture.CurrentName++;
  if (Texture.CurrentName > 31) throw "Maximum number of supported textures reached.";
  if (!Texture.Names) Texture.InitializeNames(this.gl);
  this.glTextureName = Texture.Names[this.textureName];
}

/* Manage texture names - static members - there is only a limited number of textures supported by the graphics card */
Texture.Names = null;
Texture.CurrentName = 0;
Texture.InitializeNames = function (gl) {
  Texture.Names = {
    0: gl.TEXTURE0,
    1: gl.TEXTURE1,
    2: gl.TEXTURE2,
    3: gl.TEXTURE3,
    4: gl.TEXTURE4,
    5: gl.TEXTURE5,
    6: gl.TEXTURE6,
    7: gl.TEXTURE7,
    8: gl.TEXTURE8,
    9: gl.TEXTURE9,
    10: gl.TEXTURE10,
    11: gl.TEXTURE11,
    12: gl.TEXTURE12,
    13: gl.TEXTURE13,
    14: gl.TEXTURE14,
    15: gl.TEXTURE15,
    16: gl.TEXTURE16,
    17: gl.TEXTURE17,
    18: gl.TEXTURE18,
    19: gl.TEXTURE19,
    20: gl.TEXTURE20,
    21: gl.TEXTURE21,
    22: gl.TEXTURE22,
    23: gl.TEXTURE23,
    24: gl.TEXTURE24,
    25: gl.TEXTURE25,
    26: gl.TEXTURE26,
    27: gl.TEXTURE27,
    28: gl.TEXTURE28,
    29: gl.TEXTURE29,
    30: gl.TEXTURE30,
    31: gl.TEXTURE31
  };
}

/*
  Executed automatically when the source texture have been loaded.
*/
Texture.prototype.BindTexture = function () {
  this.gl.activeTexture(this.glTextureName);
  this.gl.bindTexture(this.gl.TEXTURE_2D, this.glTexture);
  this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
}


///* Licence: GPL version 3, Wikus Coetser, 2013 */
///*
//Class for managing textures. glTexture = the texture to bind to. Support 32 textures for now.
//*/
//Texture = function (imgTexSrc, glContext) {
//  this.gl = glContext;
//  this.glTexture = this.gl.createTexture();
//  this.image = imgTexSrc;
//  this.textureName = Texture.CurrentName;
//  Texture.CurrentName++;
//  if (Texture.CurrentName > 31) throw "Maximum number of supported textures reached.";
//  if (!Texture.Names) Texture.InitializeNames(this.gl);
//  this.glTextureName = Texture.Names[this.textureName];
//}
///* Manage texture names - static members - there is only a limited number of textures supported by the graphics card */
//Texture.Names = null;
//Texture.CurrentName = 0;
//Texture.InitializeNames = function (gl) {
//  Texture.Names = {
//    0: gl.TEXTURE0,
//    1: gl.TEXTURE1,
//    2: gl.TEXTURE2,
//    3: gl.TEXTURE3,
//    4: gl.TEXTURE4,
//    5: gl.TEXTURE5,
//    6: gl.TEXTURE6,
//    7: gl.TEXTURE7,
//    8: gl.TEXTURE8,
//    9: gl.TEXTURE9,
//    10: gl.TEXTURE10,
//    11: gl.TEXTURE11,
//    12: gl.TEXTURE12,
//    13: gl.TEXTURE13,
//    14: gl.TEXTURE14,
//    15: gl.TEXTURE15,
//    16: gl.TEXTURE16,
//    17: gl.TEXTURE17,
//    18: gl.TEXTURE18,
//    19: gl.TEXTURE19,
//    20: gl.TEXTURE20,
//    21: gl.TEXTURE21,
//    22: gl.TEXTURE22,
//    23: gl.TEXTURE23,
//    24: gl.TEXTURE24,
//    25: gl.TEXTURE25,
//    26: gl.TEXTURE26,
//    27: gl.TEXTURE27,
//    28: gl.TEXTURE28,
//    29: gl.TEXTURE29,
//    30: gl.TEXTURE30,
//    31: gl.TEXTURE31
//  };
//}
///*
//Executed automatically when the source texture have been loaded.
//*/
//Texture.prototype.BindTexture = function () {
//  this.gl.activeTexture(this.glTextureName);
//  this.gl.bindTexture(this.gl.TEXTURE_2D, this.glTexture);
//  this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
//  this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
//  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
//  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
//}


