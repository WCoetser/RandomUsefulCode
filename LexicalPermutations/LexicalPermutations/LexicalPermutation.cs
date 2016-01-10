﻿using System;
using System.Collections.Generic;
using System.Linq;

namespace LexicalPermutation
{
  /// <summary>
  /// Calculates the lexical permutations for the given collection of elements.
  /// </summary>
  /// <typeparam name="T">The element type.</typeparam>
  public class LexicalPermutation<T>
  {
    /// <summary>
    /// The source collection of elements for which we are calculating the lexical permutation.
    /// </summary>
    private readonly List<T> sourceList = null;

    /// <summary>
    /// Keep a list of pre-compouted factorial numbers to increase running time.
    /// </summary>
    private readonly long[] knownFactorials = null;

    /// <summary>
    /// The number of elements in the Lexical permutation.
    /// </summary>
    private readonly long nPermutations = 0;

    /// <summary>
    /// The factoradic number corresponding to the current Lehmer code
    /// </summary>
    private readonly int[] currentFactorialNumber = null;

    /// <summary>
    /// Keep track of which elements have been used in the Lehmer code reversal so far.
    /// </summary>
    private readonly bool[] currentFactorialElements = null;

    public LexicalPermutation(IEnumerable<T> sourceCollection)
    {
      if (sourceCollection.Count() == 0) throw new ArgumentException("Source collection cannot contain 0 elements.");
      // NB: This conversion to a list also creates a orderring on the input collection
      sourceList = sourceCollection.ToList();
      // Pre-allocate memory requirements to avoid garbage collector
      currentFactorialNumber = new int[sourceList.Count];
      currentFactorialElements = new bool[sourceList.Count];
      knownFactorials = new long[sourceList.Count];
      nPermutations = GetFactorial(sourceList.Count);
      // Pre-compute all factorials needed as optimization
      for (int i = 0; i < sourceList.Count; i++)
        knownFactorials[i] = GetFactorial(i);
    }

    /// <summary>
    /// Calculates n!
    /// </summary>
    private long GetFactorial(long n)
    {
      var retVal = 1;
      for (int i = 1; i <= n; i++) retVal *= i;
      return retVal;
    }

    /// <summary>
    /// Converts the input number into a factoradic number. This is stored in currentFactorialNumber.
    /// </summary>
    private void SetCurrentFactorialNumber(long nIn)
    {
      // Convert
      long currentNumber = nIn;
      for (int i = currentFactorialNumber.Length - 1; i >= 0; i--)
      {
        currentFactorialNumber[i] = (int)(currentNumber / knownFactorials[i]);
        currentNumber %= knownFactorials[i];
      }
    }

    /// <summary>
    /// Main method for getting an iterator (enumerator) for the permutation elements.
    /// </summary>
    public IEnumerable<List<T>> GetPermutationEnumerator()
    {
      long nPermutations = GetFactorial(sourceList.Count);
      for (long i = 0; i < nPermutations; i++)
      {
        SetCurrentFactorialNumber(i);
        // currentFactorialNumber must now contain Lehmer code ... convert back to elements from source collection
        yield return ConvertFactoradicNumberToSourceCollection();
      }
    }

    /// <summary>
    /// Converts the current factoradic number into elements of the source collection, 
    /// using it as a Lehmer code.
    /// </summary>
    private List<T> ConvertFactoradicNumberToSourceCollection()
    {
      var returnList = new List<T>(currentFactorialNumber.Length);
      // Clear search cache for reversing the Lehmer code
      for (int i = 0; i < currentFactorialElements.Length; i++) currentFactorialElements[i] = true;
      for (int i = currentFactorialNumber.Length - 1; i >= 0; i--)
      {
        int countSmaller = 0;
        int countSmallerPosition = 0;
        int? lastSmallerPosition = null;
        while (countSmaller <= currentFactorialNumber[i] || lastSmallerPosition == null)
        {
          if (currentFactorialElements[countSmallerPosition] && countSmaller <= currentFactorialNumber[i])
          {
            countSmaller++;
            lastSmallerPosition = countSmallerPosition;
          }
          countSmallerPosition++;
        }
        // lastSmallerPosition should always have a value at this point
        currentFactorialElements[lastSmallerPosition.Value] = false;
        returnList.Add(sourceList[lastSmallerPosition.Value]);
      }
      return returnList;
    }
  }
}
