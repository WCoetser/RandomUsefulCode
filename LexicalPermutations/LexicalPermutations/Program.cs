using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LexicalPermutation
{
  class Program
  {
    static void Main(string[] args)
    {
      var p = new LexicalPermutation<string>(new[] { "A", "B", "C" });
      int position = 0;
      foreach (var permutation in p.GetPermutationEnumerator())
      {
        Console.Write("{0:D2}: ", position);
        foreach (var c in permutation) Console.Write(c);
        Console.WriteLine();
        position++;
      }
      Console.WriteLine("Press any key to exit ...");
      Console.ReadKey();
    }
  }
}
