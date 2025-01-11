```javascript
function isPrimeOrFactors(number) {
    // Handle edge cases: numbers less than 2 are not prime
  if (number < 2) {
    return "Not prime"; //Or you could return an empty array [] if you prefer.
    }
    // Check for divisibility from 2 up to the square root of the number
  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) {
            // Found a factor, so it's not prime.  Return the factors.
      const factors = [];
      //Efficiently find all factors
      for (let j = 1; j <= Math.sqrt(number); j++) {
        if (number % j === 0) {
          factors.push(j);
          if (j * j !== number) { //Avoid duplicates for perfect squares
            factors.push(number / j);
                    }
                }
            }
      factors.sort((a,b) => a - b); //Sort factors in ascending order
      return factors;
        }
    }
    // No factors found, so it's prime
  return "Prime";
}
// Example usage:
console.log(isPrimeOrFactors(2)); // Output: Prime
console.log(isPrimeOrFactors(15)); // Output: [ 1, 3, 5, 15 ]
console.log(isPrimeOrFactors(17)); // Output: Prime
console.log(isPrimeOrFactors(20)); // Output: [ 1, 2, 4, 5, 10, 20 ]
console.log(isPrimeOrFactors(1)); // Output: Not prime
console.log(isPrimeOrFactors(0)); // Output: Not prime
console.log(isPrimeOrFactors(9)); // Output: [ 1, 3, 9 ]

```