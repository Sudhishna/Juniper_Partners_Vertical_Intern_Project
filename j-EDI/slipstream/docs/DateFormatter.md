# Date Formatting

Slipstream provides a *Date Formatter* that activities can use to format dates. The formatter accepts dates as  either ISO8601 strings or standard Javascript Date objects. 

## Methods

### SDK.DateFormatter.format(date, format_string)
Format a date

#### Parameters

   **date**
      Either a Javascript Date object or a String in ISO8601 date format.

   **format_string**
      A string indicating how the date should be formatted.  The format string can use the following format tokens:

| Type | Token |  Output |
| ------- | ------------ | -------------------- |
| **Month**             |  M   |  1 2 ... 11 12  |
|                       |  Mo | 1st 2nd ... 11th 12th |
|                       | MM | 01 02 ... 11 12 |
|                       | MMM | Jan Feb ... Nov Dec |
|                       | MMMM | January February ... November December |
| **Quarter**          | Q | 1 2 3 4 |
| **Day of Month** | D | 1 2 ... 30 31 |
|                       | Do | 1st 2nd ... 30th 31st |
|                       | DD | 01 02 ... 30 31 |
| **Day of Year** |  DDD | 1 2 ... 364 365 |
|                      | DDDo | 1st 2nd ... 364th 365th |
|                      | DDDD | 001 002 ... 364 365 |
| **Day of Week** | d | 0 1 ... 5 6 |
|                      | do | 0th 1st ... 5th 6th |
|                      | dd | Su Mo ... Fr Sa |
|                      |ddd |  Sun Mon ... Fri Sat |
|                      | dddd | Sunday Monday ... Friday Saturday |
|  **Day of Week (Locale)** | e | 0 1 ... 5 6 |
|**Day of Wee**k ISO | E | 1 2 ... 6 7 |
| **Week of Year** | w | 1 2 ... 52 53 |
|                        | wo | 1st 2nd ... 52nd 53rd |
|                        | WW | 01 02 ... 52 53 |
| **Week of Year ISO** | W | 1 2 ... 52 53 |
|                          | Wo | 1st 2nd ... 52nd 53rd |
|                         | WW | 01 02 ... 52 53 |
| **Year**              | YY | 70 71 ... 29 30 |
|                       | YYYY | 1970 1971 ... 2029 2030 |
| **Week Year** | gg | 70 71 ... 29 30 |
|                   |  gggg | 1970 1971 ... 2029 2030 |
| **Week Year ISO** | GG | 70 71 ... 29 30 |
|                           | GGGG | 1970 1971 ... 2029 2030 |
| **AM/PM**            | A | AM PM |
|                         | a | am pm |
| **Hour**               | H | 0 1 ... 22 23 |
|                         | HH | 00 01 ... 22 23 |
|                         | h | 1 2 ... 11 12 |
|                         | hh | 01 02 ... 11 12 |
| **Minute**             | m | 0 1 ... 58 59 |
|                        | mm | 00 01 ... 58 59 |
| **Second**          | s | 0 1 ... 58 59 |
|                       | ss | 00 01 ... 58 59 |
| **Fractional Seconds** | S | 0 1 ... 8 9 |
|                                | SS | 00 01 ... 98 99 |
|                                | SSS | 000 001 ... 998 999 |
|                                | SSSS | 000[0..] 001[0..] ... 998[0..] 999[0..] |
| **Timezone** | Z | -07:00 -06:00 ... +06:00 +07:00 |
|                 | ZZ | -0700 -0600 ... +0600 +0700 |
| **Unix Timestamp** | X | 1360013296 |
| **Unix Millisecond Timestamp** | x | 1360013296123 |
  
  
#### Localized Formats
The following format tokens can be used to format dates in the preferred format of the current locale.

| Type     | Token    | Output   |
| -------- | -------- | -------- |
| Time     | LT       | 8:30 PM  |
| Time with Seconds | LTS | 8:30:25 PM |
| Month numeral, day of month, year | L | 09/04/1986 |
|                           | l | 9/4/1986 |
| Month name, day of month, year | LL | September 4 1986 |
|                                                      | ll | Sep 4 1986 |
| Month name, day of month, year, time | LLL | September 4 1986 8:30 PM |
|                              | lll | Sep 4 1986 8:30 PM |
| Month name, day of month, day of week, year, time | LLLL | Thursday, September 4 1986 8:30 PM |
|                          | llll | Thu, Sep 4 1986 8:30 PM |


#### Examples
  ```javascript
var date = <some ISO8601 date string>;

Slipstream.SDK.DateFormatter.format(date);   
// "2014-09-08T08:02:17-05:00" (ISO 8601)

Slipstream.SDK.DateFormatter.format(date, "dddd, MMMM Do YYYY, h:mm:ss a"); 
// "Sunday, February 14th 2010, 3:25:50 pm"

Slipstream.SDK.DateFormatter.format(date, "ddd, hA");
// "Sun, 3PM"
  ```
