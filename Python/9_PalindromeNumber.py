# My approach
class Solution:
    def isPalindrome(self, x: int) -> bool:
        if x < 0:
            return False
        reversed_num = 0
        origin_num = x
        while x != 0:
            digit = x % 10
            reversed_num = reversed_num * 10 + digit
            x //= 10
        if origin_num == reversed_num:
            return True
        else:
            return False
          
# Approach 2
class Solution:
    def isPalindrome(self, x: int) -> bool:
        return str(x)[::-1] == str(x)
      
# A3
class Solution:
    def isPalindrome(self, x: int) -> bool:
        xx = str(x)
        ll = int(len(xx)/2)
        
        for i in range(ll):
            if(xx[i] != xx[-i-1]):
                return False
        return True
