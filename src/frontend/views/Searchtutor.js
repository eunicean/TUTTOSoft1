import React, { useState, useEffect } from 'react';
import '../css/Seachtutor.css';
import { useNavigate } from 'react-router-dom'; 
import baseUrl from '../../config.js';

const DEFAULT_PROFILE_IMAGE = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCADIAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDSBCIAM4/KmMoZg4NSE4QBsZHSmY2EEcr612t3Pm4aIUqDx60KMDBHIoYc5HXtQDu7YPepLBsDAP8AOkZctuWl6fKRkHpTd5C+oHFADiQSOOaY+d2QetOOOGFITnGaYA21l4GKaCHxnqKVht5H1owGG4dR1oBgUxhuvtSADHyjmlzhsHkUYx938BQAoAI56ijOeG/OhfmGQeRwfelPI4646UCGLkEK/bnFKQA2QMrShgxPrRxypH40hjiOO9IBkblH1pM7VyMEg1JvAUMv3T2ppXFew1QHLArkjpSDbgBgaVwGckcGn8EDK9+tIpMZgo5JBwe9LIDnIB45oxjKn1yKbyOevqKAQcMOKUA42kc0gAzlevpmjP8AFgZHagBQ2W+fP1oo4YehHQ0U7mTimxzlREoYAA8DFNB2g/3PWnPzGoJpmMYx0PtQOIoOPuYOPWkBGQwPWgLsOR0o/i9j7UixThhjPNIPm6/jQQB07Uow596AFAK8YyKYVz0OacDwQw6e1YUuqX9zrr6T4c0ifVb2KHz5kicLsXI9Rz95fzFMcISm+WKNrJXg84oxtOV6EVmaVfXVzqGoafqemy6dqNiyLNC7BsBhleR7f05rGPifUbi3u73R/Dupaho9sXEt7HG/lLtGWJYKQoAweSODk4o8ylRqSk4Jao6o/ewfrSlioGRwO+K6Pwh4dg8UeHrLWLa+VLe5XcgERJGCQynJHIII4yOOCetY3jaWw0TU4NA0iO81vxNcYItLcKqxA45kPO3jn2AycDBJdN2RkrylyJalQHDbhk5pzKwAI5HWoYvBPxMOn/aha6Esm0t9kMjmTP8Adz9zP/Ase9XvB0tpfa03h3xXa3+heJwu5IHdXiuFx95GAwejcZPTgk5ALroXKnKK5tyoFDfMv3un1qOe4gSW3glmVZ5i3lJj720ZP6V3114BmCf6LexOSfuyIVH5jNea+L9D1DSvHHh1LqL5XW6MbIwYMFjyx45AAweQKSaZNJqo7X6P8jTR8E5/GgEqcADaeoApG6A9wPShZOD0NO4h4GfmU5Ipy4x196w73xPo+nXRiuL1FkGdwQF8c9DtBwfY1NpniDS9TcpYXcbvu+4cq3rwDgn8KDTkmlzWdjX+9x3XvTT97njPelEg4BAJowMnPIP6UidxAu0gYyBSsRncMY70A44I4PtSDBYjHB7UAxzY2ZGOO1FN4GBxg+tFUZsHbdGA3XNJGSoK9fSlcKVjYAjj8KTdj5gOO9SVEVW3AZ4/pTBkHb1XPFOPIJX1zxQPmx60FGt4b0S51rUkjgjZ4FdPtDK6qUjLYJGevGexo8S6Bd6FdussRS3eSQWzs6szop4Jx04I6+tZsM0ltcwXEB2zQusiEjOCDkHH5UTzT6hqEsgQyXNxKXKxqfmZjk4FRafPe+hd4KFralcOHAyPnHWsvQfCOm+I/i/Yad4jsJXs59NNwI8tH5uC21sjBIwOoPYV7B4U8JQ2MUd1qSCW++8EJysXoPQn36Z6dMni/GEjxfHzRjHO8Dto+0OjlT9+XjIqatXlhJrojbLIutio011IPgZpNnp3jHx/b2kIijsdQNvCuS2yMSTKBk5PAHc/WuRsvhl4f1DQviHqplvYJtCu7yO1t4pV8sJGCYw25Sx5GPvcgfjXYfASRpPE3xBaR2eRr9WZmOSxLzck1z9mUGm/FthJh/t12pXPbE2P5n8q1pp1LWY61R4XEVb62aX5I9X+HUdpo3ww0Nol8q2j09LmTkn5mXzHPPqzMfxrjfhdpcOoeAbnVpPEsGj+MfGE0oiv5NhmASXaY4UZhnofu4I3r/dWu38DwxX3w00K3k+aGbS4YnA9DEAf61wnwo1DSbPwq2j+JNCbUPEXg26mktrWCATXBDOTviBxu+ZjwD/CjddtYzUnF8osHKKqT5+/+f6/jY2talntf2m/Cdq97cSK2gvExZwvnHM5JZVAU5KKSAAMqOOBir8Q/C0P/CJ65Df+LF1TxRo7TazYzyeXHeWcIIcIQhBxwRuwBkrgAKoHcXo8F6z4y8MXOsW0KeLJLU3Wn292jLcRxgbvnToGU7iA3IZXK8qSOF+JXiDQD4f8Q6jZ+Hbyy8VawW0GFb2zaC5vlAA8yNeWZMOMMQCSqKeiiuei5Oasrd/67Hp1+Xl1+Xqd/wCD9VbXPC2k6o+zzLu1jlkEeQocqNwGewORXF+OdRsLX4u+A/tN9bRGFb3zBJKq+XvhATdk8bjwM9SMCtDUbqT4dfCFZBGjXWnWMcOE+ZPPbam7nGV3tntxXk+jaV4Tl0HGsz2l/q14BPd3U90DKJDkkAhzjBYgnPzHk9gLr4iGHXNLr2OPKMqnj6k3Tdkrr7z37V/D+naoCZ4Akx582LCv26+vTvmvFPEXhfU9Y8bN4N0K+gDpbG5vLn7vlJgbUYdRklMgZ4de26uo+AuuTzQax4bvLsXX9kSJ9kmMqsz27Z2qAOy7R3ON4XjAFYWgaz4ttPHHxKj0TQTqt3POsbSteJA1siiVYWAb742kHA/uj1Fa3k4Xh8jnpYd4fESp1fsnlGNEh8JeIrmTSr2K91GZF0mWSLfDDEkyM6rITy+3Kk7eAMZG4itW7s9O8Q+INDuNH0260+z1CCHTpLw27Rw/2hjAdCpK8kKCMdN5xk7hsnVfEDfs9f2d/wAI4DoR6ar9tj4/0vd/qvvff+T9elbXibXPFc/hnwQk3hQW0NvqNjLZT/b45PtUiofLTYOV3dcnpjFbLY65zfNpvdr4l27foU9Bnvre9v8AQNdx/aenPsdh0kX+Fx0JBGOcdCO5rcOVbnn3rB1q71K9+K7zapoqaRdvYjzoBcJcEjdwxZOM8KMegroEwRtPfpTa1PPn0fdX0EJwcDlcdKXhiD0Ipudny49+aTO055xSJHEA8dT14opP4eKKCGPBCxgEj2phAXoflanSY8sFT0pqkkbX60xR1AEK/GOKHKlgykn6UD5T8x46ZqjrMXmaZeRCRI98LqHdsKuVPJPYChIrrYz7rxfokcjRvfLvXglEZgfxAxXWeBvHfgbTIDdX+sAag5I2m1mPlLnHBCYyfX049c+War4v02XwNomj22kw2V1YXsVxPPDCuZiiupJk3ZYndnBAA6DgCu2m+NFi0KC50SNhj+PT4sfq1c86skvhZ71PJaVXeql6v/gHpH/C3fA//Qc/8lJ//iKb488C2Pjg6fqthqb2OoQx/wCj31uFkV42wcMONy4LYwwHznrnFeFaT43sl/4TWS40WC4Gspsh22abbYbZFBGCNh+ZTkZ5Gete+/B/T5tM+GuhQXLIztCZxsORtkdpF5/3WFP5HmYzC/2fy1aM9b/0y58P/B1p4N0mS1gnku7u4k865u5QA8z4/MDrgEnGTzya5LxJ8HLXVNfvNQ03XL/S7fUZTJqNrENyz5PO05G0nLnkMMscADiodd1fWvGfivWdF0TW20PQ9H2RXV3bJvnnmY52LypXBR14I+62SQwAw3tdIhkeOb4seIBIhKsp1BAQR1H+tqZYmFOXK3qXh8txdde3T+Lv/X/DHt2m2UGmadaWFmhS2tYlhiUnOFUADnvwK4nx18O4te1i213Rb6XRvEEGB9rgGfMAxjevG4gAr1GQcHIAFcIY9EH/ADVnX/8AwYx//HaCmg7f+Sta+G9f7Sj/APjtQsVTTvf8GXHJMXGXMnqdQIfjFHY+T/avhqScIUW5aNzKM9x8m3PAPTHHSrfg74dyW+tDxF4x1CbXPEAIMcs/3LfqcIucAAliO3IwFOc8WV0Lbx8Wdfz6/wBpJ/8AHab5ehkYHxZ8QZ9f7RTH/o2q+t0uj/Bms8pxsla6PbPEGjWHiHSJ9M1eD7RYz7fMj3sm7awYcqQRyB3rj/8AhTngT/oBf+Tk/wD8XXDCLRO/xY8Qn6aig/8AatO2+HwMH4qeJSfX+1I//jlT9aprr+DM4ZLjIK0ZW+Z6r4T8E+HvCc1xLoGnLay3ChZHMryEgZIALscDnt14z0Fcf49ttR8H+LX8b6PBJdWNxCINWtoyxZQoAWcDODhQB0GAD/eJGTLrGo+AIdP1iPxNdeJPDN3OI7iC9TdPCrqCs0coLbh8p4yByBjLbh7TWlOrGXvwd0efiqFbB1bV9b/ij5Ns9XFx8LPFuhwa9dyWmlTxPa2TRwqk1s1ymJMlfMJ3HJAIALKD1Ird1jxDDZ+KNAttQ8RSahpGgWUV/LAQilLtVwsKFEUOwJTgk4G8E8NXqHiP4N+DtbZ5VsJNNuHYMZbB/L4AxgIQUA+ig5/Gr/hX4W+E/DU0FxZ6aLi9iHy3N2xlfIYMGAPyKwIGGVQR+dbOot0ayxNFpvW78l1SW/8AW55DoNte3+q3/iPV08u+1BgUjP3oo8DaDwOcAds8c8k10IJcfNywrsfH2hm2uDqVsGMUp/fKBwjev0Pv378gVxRyx44I701K+pjzKeqHiVVIDEZ70uwZC5yDVdrcPMGLYJqcHA2scY702ArcAnr60UjMeSPmHpRQRYUcRAHIHpQRkAjHFPYrsTFRqCHOeQe1MUBVK7jnvVbUtPbUbC8tfNSFXhcGaQkJGNpyzEdFHUnHQGrHJyG/CqN//bbJcW2k6RJexXFtLbvKDtVd6lDg9MgHPPqKTdkaRi5SSRzet+NtXuPAfhq1uNMvIdO026gaC8EP7mUxKyja20Zbg8Z7GvTl+KHikKP+KX8Te5/s4f4V5nc+HviBr3hm00NtMWWysZAyH7QgYFQwA5fHAYjgV2M158VuiaHbqfU3in/2rXM8BhqiSlJ/e+p61XNMTR+CEH68uy2+/qc34Z8banp9v8QY49E1C5Ooyzy3ANtuW3Z/Mz5w/g6nI9m9K9f+C1qtn8MNChW4huAY3k3wtuUb5Gfbn1XdtI7EEV5Dp3h34kWB8Qm30aLOtljclruM4zvzj95/00PXNe2/DfQ5fDfgrTNLuWDTwozSY6BnYuw98FiM+1aSpQpr3Xv+hwY/FOtBJ20fS3bXbs9EeOWRYf8AC3tpwfPnz+dx/ia4PTbPTk0cXV5bxsEQEkLyeB+pJrvNP+98X/Tzp/5z1xFrbG78OC3VgrOilSemQAf6Vhh/4tX1X5I9LGtLC4e7sv8Agk13pTaellNrPh1rCzvP9TPIAyk9g3Hy55PPPfpzVhdEsXOE0+Fz1wI80usatqvieC1stWghiWNxJPOh+adlBUcDpwf/ANXStzSde1TRGlbSr2a1MoAfy2wGx0yPz/M10U3UcffVmceYrDwqpYWo3G2vr95gnQLPftGmIH9PLOafdeH4bPYLvShBvGV8yEpuHqM9a6Z/G3iiQk/23qAz/dlI/lWXqmr6nqrRnVL66u/Lzs8+Vn25xnGTxnA/KrvLqcLnppJ/18yPSfCNpfwSTMljaWyME8+6fy0Ln+EHucc47DrWd4g8NRaTcXFtcWkSyxjIKgEMMZBB7g10GmahYSaU+layt2LP7QLpZLTb5m/btwd3GMfr61Q8SXyXs8jQK8dtHGIoI3bJSNRhRn9fqTXPCVV1mpL3f+Gtr9/9b9M3BUU4y9719b6fdb+rQxFj8CY97EqLshAT0HmZx+eTX01rT6kkELaTHbySeYPNWYkfJg9MEc52/hnvivmY8fAm2Hren/0M19VVhQ+3/iZ359LldCVr+71Of8LXc12IGsPs03h8wHybkOTK0gbBBHTs+T6496yPiB8QbPw3INJ0wLf+KLkxx2lhzgvIdql26Ad9uQTkdAdwt/EXxf8A8Irptulnb/bNav5PIsLT++543HHO0ZHTqSBxnI8y8b/D+LTPC76trGpfbvEE5M9+spAinI+YhO6FRwHHrjADYHXSpOyW55sp0q1b29VcsZPRf1+P4Hd+FfGcHiWa58L+KbFtJ8SxoUns5cbZSBy8Lc57MBzxyCwBauP1Szm0/UprWY4kibb9R2I9iMVj/BG7TVfH6X/iOXVpr02zpoc19IWVolLiRd5xvYBj04+/nBxXpPxN00ebbahGvLfunxjr1U/z/IURdnYWJpxo1nCOxw+7k5/I0rDuTwaaoyuG6+tOGV+U9K1M2GMYxz/WigZXntnn2ooIA/dGcBqTdkYbg+1SOFaPHTuKj24HOc0+goisxD8Af416j4K0+JfDlu7xkPKWkbOR3wP0Ary4jB9cV7VoqGPRrBGGCsEYI/4CKzqPQmozn9M/sbw3rEeizaiX1HVJpLiCGTO4jqRkDAHBxnGecVj6x4+to9XCaLFBe6fp109vrk0m6M2YDBMjdjODuOQCCEIHqON16TxPrev6l4sto/DaQeEbu+t40nWUSzrGM/MBkMQOV5X5ia5TxCNS8aXGpa9a2elWNvaWcE2pQ75YTqH7pJirqrEMNwO0gq2CMnIBGXPCN23selDAVKrTkrtq/wDXy/E93h8beGJ9P0e9i1GI2+rzG3sSYnDTOH2EBSuQAwxkgDkc8iukAAHFfPuu6lq/i/VdKt9LsNAs7fQV07ULZZUkUr5tuknlfLkeXnggBeFWvYPhzr114m8Fadq9/HDHdXPmb1hUhBtkZRgEk9FHem2ruKeqOTFYCeHoxrSVlK/9f5njVjwPi573Fx/Oeub8JpdS/wBlJpwBvWaMQA45kyNv3uOuOvFdJZ9Pi5/13uP5z1yXhpUls7RJ5GihyqvIqbyi4GSBkZwD0yKzw38Wr6r8kermX+54d+TPacfGJuGIx9bOiGP4uQptR2xkn5pLRuv1NcCNI8Mt18TXq/XSv/ttB0fwxnA8S3x9/wCy/wD7bW3Kl0X/AICedzt9X/4EjvyPi6f4v/HrSnf8XhA+RgPxs64H+xPC23J8VXY/7hZ/+OVS1TTNDt7ZH03XLi+mLYaN7IwgLjrnce+OPejlv0/8lB1Wle7/APAl/kd5eQ/FmQN9qZSh65NnXleuxXME93HfAC5Ut5gBXG7v93j8qbI0YIVHBqz4qt9PgvbxNEnmudOC/uZJl2uw2jORgd8jp2qoQcZbfgZTnza/mw2h/gPbt/cuyf8AyIR/Wvqg5CnaATjgE4r5XtW3/Aab/YvMf+RFP9a+kfFfiPTvCuiTaprEpjt48KqrgvK56IgzyxwfwBJwATXJhl8f+J/oetn0XL2CX8p4DoPjK+0vx1qHiHxbZw391Gz2cyxEmXSdrEfIn3fLOSu4E9TlssQ+zFHefF7xYixO0fhSydWu5DlRMc5ES9CSe54xyf7gPYyeDPBHxEtLnXdHkdZrzKPd2UhjZXxhgyHgEg4YEcg575PZeGtB0rwhoCWGmotvZwKZJJZGG5zj5pJG4yeOT0AAAwAAO1VHFNHmYmrQbjOEWppWt0Xmv68zw/XIG0Hw/wCJdHF55t14L1C01LRp5FDSLHMyhomJH3BvQkDGWHpgD27xCsOqeFp5YXBieEXEb4zkAbgfxH868Q8TXcWt6N421q2tnf8A4SbULPSNH2/fn8llLuA2Pkby055wx2nHNfQMFnBDp0dkqD7MkQhCH+4BjH5Vjs/ma45vkpuXxW1/A8Vz1yMNQGBGDwwNK67ckDjNMk5G5O1bo5hQezcD1ooU7lAxk0UEiEkqD2py46NyO1JtbaueMig4Iz6UyYA6kPxwPSu2+L3ibUvDui6QNGmisvt95HbSahIgdLVDznB4zgHrngN3wRxDHcMgnNexaXDBqPhmyhuo47qCW2RZEkUMr/KMgg8Hms6nQqM1CalJXXY8Caeyhs9Tsp/ihbJBqcss92sWkiXzHkGHOQcjPsQPSoYbfRIrO6t4/iighuoI7aVf7FPzRpEIlH3sjCADI5PU5PNeq2vwr0SDxfqOsT21rNbXUSRx2D2ieVAQFBYZyMnb6DGW65qxcaR8PoNSGn3MXhqO/wByoLaRbcS7mxtG0jOTkYHfIrn9hdP3t/Jf5HsPOYKS5Kb0XRvTujyO10/T7aaWax+JtkJZYoYWL6eqArEgSMfM3GFAGe/fJroPhTrOp6R4y0/whZ6raa7oRtZJvNtUUra8u2Sy5OS2B8xx+8HtXd+KPhp4f1fQruxs7Cx064lUBLqGzj3RkEHIwAe2Oo4Nbfg7w3ZeF9It7K0ggSZIY455o4RGZ2VcF2A7k5PJPXrVQp8snJyvfyRz4rNaeIw/suTbbVu3muh49Z2QTxb8SdCupo4LjUJN8ZzuwsgkYNj0AkTPpmuWHw98W2yCO3m0x0AwCl4FB7Z5IrrPid41+HOvakYL631a7vLT93HqelqgwM5IVmYBxnIBKkckqecnj0vPATIzCX4g7QMk5g4FJUKsakqlOVua2jXyPQo4qjUw1OliaUrxHf8ACCeMQMtJp3/gcv8A8VT18BeLmGftmlL7G8NS6ePAF3qdnZyXvjm0a6x5ctw0O3B+6flBYgngEA16e3wV0U/8xrxF/wCBaf8AxFNrEL7a+7/gkVMRltF2qUZI8p/4QPxePvXOmY/6/R/jVC+8Ka9Z3tj/AGpZW+qWazLLLbwXgXzFU8qWzlcg4yK9k/4Upog5/tnxDn/r6T/43Tv+FMaKeuteIj/29p/8bpf7R1kvuf8AmTDH5TF83JL8P8jzh7PSPKO34WRK3YnxE5/TdWBpfhDXr2e5itFs9NtmdnSC4uiwRSfuhhnOM9+TgmvZf+FLaL21rxGPpdp/8RTT8EtBPXWPEJ+t0n/xupUK0fhkvxf5s3qZrldSNpQk/u/yPO/EOnr4c+HNr4YEy3mrX1wCsdtlw7FxgLwCeAo6dT7ivZ/iV4Nl8UwabeaXeCx13SZvtNhcOu5A+Qdrrg8EonODjHQ8g1vCPwv8PeGtT/tCEXV9er/q5r2QSGL/AHQAB+OM+9dlqeo2mk6dPf6lcR21nAu+SWQ4Cj+p7AdSTgU6NN0k03dt3fzPLzLNI4qtCWHjyqCsj5+1GPTNN1H7RrFnr3w21yXZFJeaWhm0yUgBydqEH5umxCVGBnJ3UurazomszQwap451/wAaxt8iaJpWlNZfaGBDjzOgZPlwcAuMgjpUPxG+IGh6/wCO9KuLTVSumaZaSPBcCyZiLp8gEKwGduI2GRjKn1rhv+EgddEtbi88Ryalr+n36Xlk0oln2KAuV3yKOrKGwcj5Bjqa640brf8Ar8zZVpNx56fvaa2fW/l00vrpc978F+D77UNVtNe8U2UFhDYr5ejaFE26LT48/ebs0pwCW655OCFVPTcVyHhrxn4a8fW91ZadcvI/lZmtZVaKQIeM+4zgEqTjI9RXQafp9ro9vO0bzCM5kcyTySAdTkBmOOvOOveueV07W0PMrSdTmlWbU9LK2lvW547IxBOcEUwja2QflPt0p74bOO3emBdp2tjae/pXQgYpAxleSO1FI/yDK9x0opkMlBAiVSenemrgPweDSuP3akHNImWB/vCgcRJOCcdq9L+H1wl34ce0YgGB2QhGIO1vmzxyOSw/CvNFbLFT3FdN8Pr/AOxa39mkYLHdLs5wBuHK/wBR+NTJXiKa6m/4/vJfCHw21OfRllMttCEhMkrSshdwu/cxJO3cW544x0rjtJ8G+FDpmj+HLrTY9RuNbsJb6bWQQ0wkHlHcjkZCnfkY4+UZDbmNcyWtPE/hRvFvjjXtdWyvL5rf7NpUoaCwjOVHmoVO0cAZAJO9Opasq+0PXYPHukeEdL8Tebpd1aP9hu8BilnKCzrlR8xxEQMHBwMFQSB5WIkqv7uEuXlv3Wy/TsetQpSpp80tXqz1b4D63f6x4Gje/kMstlcPaRXGDmaNVUq3PX723Pfbzzmu7uYDdW80dy5Mk8flySR/JnjGQOcGvny4s9L0Pw9reo/D7xLr6HRJYgZZZ1NlcsX5RcKA5GfTB3L1DZr1fV/HGm2Pg/SNS1IXCXGsQRG2srL95cSPIqnEY4zt3Dnjt3IB66U4VnzxWq0137nBiaVSEnGm9JPbzPJPB/xXj+H2mv4Xu7HT9YjsJHWK+tCWSQMxYj5gM4ZmGRwe2epueIvjtaax4e1TTV0GKJr21lthJtA270K56npmrXgXxh4r8JeFrPRh8LtWvjbl83DWsqF9zs3I8o9Acde1dEPit4sPDfCTV8f9cZf/AIzWjqO/wJ/NHr+wi9Wzyfwj4n0/Q/FPhjUraCXVJ47IWM1tEhEkbEgZTIwzYZgAOvTIzX0P8RfFMfg/wjfaswja4UeXbROR+8lbhRjIJA+8QDnarelcDP488T32s6ZcP8MtZsYbaYtK8NjJJIyEEEAbF5wfXFc34+uvFXjDxTC8vh/xnY6BZbZbKO10x1mEwA/eNzjcDuwQeABgAliXB2jqv1MsbQlj8ZGbSSsrvpppY7210L4t6m9vcX/iLw/odtMgd4YIPNkiyM7SroQSOh+fHuai8Vx+O/BFg2vnxZpPiHS7Mbru0uYIrJ3GQNsZXOWwSR8wOQAFckKeCNp4hJ+YfF36hJP8awNY0XxRf6raRXek/EDU9DQiSSHUIJncSYYblHK8Aj9R3qYtvVv5WN5YKmpKHLGz6np3hrxD4x+Jt3Ld+G9Y0jw1oVvIVw4jurxlIwGeM5C8qcD5OCfv4zWteeE/islyRpfjfRbyAD79xapE2f8AdWJh+teMf8I5r1lrkM3h/QPHGmWrptuZbezkSVx1woXAA4HVj644wd77B4iC5j/4Wyr+9vJ/8VTk5Nc0XbyshxwVFS9nyx9f+Cer/DLxbe6zPq2heJFgh8SaRMYp1j+UTIDgSqDyRnqQMfMp43AVyvxH1DWvGfiTWfAWlS6RYWlvBDPPPfSOrS8o+FKg4GWTjb/CeecVwcdj4r0TV4dd8P6N46n13zQJpdRsHeOeHbgo+AWbOEHJ4A4wQCPV418GfEzWJrfWtEvbfXNOTDWmoo9rcLEcEEhG5XLDGTxu6DdzSbautH/XQ4K2GhgsR7Vx5oeXRnOx6B8QbfhPFHhIDpt8yYgD0A8vAH0pToXj9zn/AISfwn+Dzj+UddcfhF4G/wCgH/5Nz/8AxdL/AMKh8Efw6MR/29Tf/F0e2xX/AD8X/gP/AATFSyjf6v8A+k/5HnF34b8XaFrH/CZ3GueFrm60q1kYRmWc+YgR8qFKjJO445HOK9N03xU2ufC2HW54Ehnu4GiaIHA37jGxXqccFgOeKhHwg8EH72ik/wDb3P8A/F034hTwwQ2WkWaJFBCoby41AVABtRQB0wM8emKmLnJ3qO79LfqycTVw1Xlhh4ONu/b5HFk7h/MUo5BWmnO48c+1KGBG5eCOordGIDqdw4755opVIbI6HPFFMhkj/cG4EKeeab0wf4SPyp7AiMegqOP7hVhj60kCFYHkjtzRHKyyRzQuVkRgwYHBBGDmjvjrTGXgjpmmhtGf4ivtE0ea9GmeK7fSxqqie/0O5sXubfzGJV2BUN5e4chODjbyBtA8xv5ID4hsLGLxaLjSobf7Mmo/ZZYzDCwbfGY8bj95wBkghgMgZC+haR4m1rwZ43u20qwjvTrphggAkVHMi4ULllOMlunQ5HPBrrx8TPHh5Hhzg+l9D/8AE1xVqipTf7ta9bxV/vPpMBgJYimqkJ3010bt90X+ZyHhCPSPElxpXhrU/FennSIGVIdOsbWaD7aRk/vHdVCsTgkAncScYbBr074oeH9burjQdZ8KRwS3+jvKq2bkJ5iSqqHaxIClQOM/XqADxEOu+JPiR400OyudJitzoN9FfXM7zI/lJkNtDKo+8AOBnJAzgAkey2Gt6fqWoalY2U5ku9PZUuYzGy+WWBI5IAOcHpmrhZwvy2v006+nc8jHqeCxK9nK7j5bPzVl+KPDJPiP4ojF+W0aVRYSSRXP/ExX5GT7w6c49s06D4heKbiGOaLRpWjkUOh/tNRkEZB6VOUR/DfxILqrbdU1IrkZwdo5FWPB2j2934a06WaSZW8iIYUjGNin0968PFKjR5koLR23l2v3P0DLpTxMYyqzteN9FHv/AISmfHfi3tokv46mp/pSjx54vHTRJf8AwZrXSf8ACP2naW4/76H+FWbTw3pkjkXN3cQrj72A2fyFcar0n9hffL/M9KWHppX55fdH/wCROS/4T3xif+YPN/4M1pD478Zf9AeXH/YTWu6PhPQs8atcf9+z/hVXUPDOmQeX9jv57jdnd8m3b0x1HPf8qv21NfYX3y/zM4wpSdlOX/gMf/kDjf8AhOvGP/QJnH01Naik8d+L1RmfTbkKoJP/ABMx0rrF8P2p6y3H/fQ/wrK8VaNa2fh7UJY5Jy4gkxlhj7hPp7VVPFQ5klBf+Tf5mzoRim1N/dD/AOROZf4peJLfT4tQeyuVs5W2JJ/aGcnntjPY9q77wL4c8VXvxB/4SbxfbtYra2ZtbeL7WJnfJJ+bbkFRuc9udvBwTXmPiMK/wU8PSFRv+0bd2OcZl4r6mbivbwsKfvTUbNNrd7L1Z8FxDmNdU4UW01OKb0V/wSPJvEWr+J9R1zxt/ZOvpo9p4ctUmjt1so5jckxNIcs/KnK444xjjIOaev8AjTxRfaL4Di0y4h0q+10yG5nEIkKhNoyqtkYIYtjrwBkc5wvC8viLxpH4s1rTbrwtpsGuE2M1vqNxKskarFtBTAwTtf7x6kHgdK0rnwl4wuH8Nk+IfAqHQYjFa7LqX5gVVTvyhycIOmO9dinCMveaOH+za0qcfZ09Ut7dbemup2Xwx8R6jdeGddn8S3i3c2lalPZ/aFjWIyqgXHyjC5JbA/Ae9cpql7JfX0t1L/rJW3YHQDsPoBxXMaNfatpmu654Wvp7C6Q3TapLcWDFo5JZFjOAxAyoB6YGDu68Y3kIICn0q1yvWOzPOq0ZUajjJWY4g/eHT0pGzgMPy9KeDtODTT8pz2PbNUZtCkBkyn3gOaKDjA2nBopkMU528cGhxtIPX6UNjYpHHt6Ug9D07UikBGc0oKsBu4NGNh4I4qtfW0d5bywSZMMylXCkqSD2yKaKtcxPGEsumxWGrWqxvNpd7DeKrjhtrcDjtnH5V2UOo2ctqLi3ctC6+ZH8pG5TyOvtivP7jwHo7j5BOuOuJD/UGoP+EA0sYINyfbzBj+VcuKwv1i2trfM+jyXOqWWRlFpyT+X+Z3/wF1C3k1DxNfXF1Hm+uo4IeMAiJWwc+4dfyr2l+hr5fXwTpSdEmBH/AE0613HhvxBeeG4I7e2fzbJAFFvKxYKo/unqP85BrZ00klHoeDj5fWa066esnfb/AIJlZx4c+JQ/6iWo/wDoNZfhXxH4itNAsYbfwTq93AIUEc6RybZFCABhiMjBxnrVrTLoX3g74gXWzYJ76+l25ztygOM9+tex/DeeGfwF4fEE0chj0+3VwjAlT5a8HHQ15sKFOvUqqor2kvyPpMXmVbLsNQnR3cbM8oPizxNj/kQdb/79Sf8Axus+x+Jk11BHP/wjeoNbyzC2jlg/eB5SMiMHABYjsDmvooZr5o8CnPgbw0B/0Ott/wCihVrLMK/s/izDC8R4yspNtaeS8zpT4s1T+HwZ4mP1smFZ8nxCuUmu4R4Y1bz7OPzbmN4yrQpjO5xjKjHOT2r38oB0UflXiWryBPGnxYTgMdFBH0+zLn+dL+zcN/L+LFhuJcZXk4uy07eaKVv408QXMEc9r4G1eaCVQ8ciLIVdSMggiM5BHeqXiHxB4jvtHuopvBGr28RifdI6vhBtIJOYxwM5/Cva/h8P+KE8Of8AYNtv/RS1J40ube18Man9qniiD2soXewG75DwPU1UcuwylpH8Wc74ox3M46dtj5y105+COgf9fZ/9Clr6pcV8p6zz8ENAP/T43/oU1eleMNan8U6fNp96qx6fNjdDGSM4bcuW6kggeg46VWDV1P8AxSHn9PnlRX91HM+Efs9jLr1q/wC7WLVrhAoHAA2jHH0rWsEsrS5uZxfXc5mbdslyyx9eFGOBz+grkT4H0cceXL/38NIvgTR+pWcj3kpVcB7SblzWv5f8E97CcVUMPRhSdNvlW97foy1oyhvGGuyjqFhX80/+tXRn5unDCuTbwNo3QpMv0kNdPaWqWdrDDAv7qFAi554AwK7qcOSCj2R8pmGIjisROvHTmbdu3zLKMGwCOaD/AHTwexoC87gflpTjbuz09KZxgFwPQ0Uv31wTz2zRVXM2gkX5VwOPbtTQMx4POOhFSOQUGP1qNDgDd0NJDQi8HnODUd3dQafaS3N5KIraIbmdu3+NWCPSosLJG8cihlIwQwyCPQ0FHPt4x0Fjlb//AMhP/wDE0f8ACW6EFwL78PKf/wCJrVGkacuALC029v3K/wCFB0nT2PNlbfjEv+FBr+57P71/kYx8X6Fni9/8hP8A4VDN4t0NlwL7n/rk/wDhW6NI0wPh9PtDz/zxX/Cg6Np6fMtha49BCo/pTHel2f3r/I4vSfFenWvhfxLpzyfvb2e5eE7W+YOgVe3HTvitHQfF2j2Gk6eh1BormCFFJSOQFWCjOCB6+lb50fTiQRY2uP8Arkv+FMbTNOzj7Da59DEv+FZU6MacpTX2jrxWPjiqUKUo6Q2s/wAya1+L62qqq60ZUXostuzZ+pK5/WuD8OeJLHT/AAZpdo12EvrfxFDqRTy2JSNY9u/OMHkdOvtXq/h2DTVV7eDwbo+qS43ndYLK4Hrwp45FXrGTS75nWx+H2g3O0ZZYdOViB74Wrcn2MKMqNNaX1/rt5nNy/GFcfJrWf+3T/wCwrk4PGemXGp+Or/UL8vc6ppn2W2byWHmsYwuMBcLjaBzivWPsUeePhjpQH/YK/wDsKhvY7W0t3nuvhxo0EKfekk0sKo5x1K8daXNfSwUvY0W5Rv8A18jh9C+JS/2LpGkjWXhaKGG3WOKNkIIULjcF/ris3xJ4l00HULOe8Y3imSKQMjk7+QcnHPPeuy1iwtL+3tb+38KafptvG2UubWyCBmz/AHgMHBHHvmsqfTLK4laee2t5XY5ZnjUk/UkVpFmMvZc90n/XyPPNQ8RWc/w00zQ0b/S7ecyMMHgFpD6Y/iHeusPjLQ8jF7/5Ck/+JrXGj6W3/Ljaf9+V/wAKX+wtNIz/AGfZkevkr/hWNKjGkmo9W39524zHxxbi5xtyq2j/AM7mYnivRGhMv2w7A23PlP1x9PapbTxRo9zdRW8F3vmlYIimNxkngDJFaMWlaf8ANCLK2VM7goiABPrjFLDptnbXCyxWkCSKeGWMAitDj/dW0T+9f5GZc+KtFtrmWCe72yxOY3XynOGBwR09RW1a3MU8EU0DboZUDqcYyCOOv4VE2kafI7PJZWzO5JLGJcsfyq0U8oAADaPTtQRLkt7t7j4wPmUdKDhGwOQeKRQMccZpV+cY5BFBIjfcyP8A9dFJ0PPc0UyGOHyquMEUDByrcjsTS4zEmMZAxxTMdVJ+lAIBlT9KVgPvUikchjwev1oyUOOKRaHKc5x2pG57YxSgFTlTx3oYdwKBiZDCkyQecYpWQ5JXv1oPIw34UyRjKRk44zSPGHUOMZFKxKkbhz0pWXaMj7p/SgdiXTb66024M1hPJBKyFCyHBIPUfoPyp2n6jfaY8rafdzW5lADmNsbvTP8Aj7+9VwoIyMZHpSrycd+hoshps1U8Ua5uI/tW5z7tmmX/AIi1i/tJLS8v5ZLd8b0IHIzn09qzWQjlO1LgOOfvDmlyx7A5y2uTnUr3+yxpZuZPsAO4Qg/L1z+WecetUyu3kdOlSZBXI7cGgAYIPQ0CvfcEAI4pVbn1H1pAGHK5yO1O+VgWHfmmIGA6jGRS5yc8c0oIBB/hPekK4Bx+dIYAZYDHIoZiDhuh9aFO4Ec7hQhCkLJgq3SgGCHawBAxQww24DjvQcH5fT2oX+438qAFGGHFFIRtzRVEO45sbAVbI7mmkLIAQ+G7CiikQnoO2L1DDcfekBDKPm5oop2BSY1eMq5Iz0pUwo+8cUUUirijgnkYppwMNu/GiimFxWCt/FnApo2glSxoooE5MTaFIIfNKcZyGB70UUBcAw5Ibnp1oDKTnP50UUh3Ahd5wfelYLsHzDdRRTC4K4BAJPNBI3BQw+tFFJCbHAq2QWG7PSlUgDO4DHeiikyk9BAFOPmApwAbhieOc0UUxXE6AkEU1tpwwbHvRRRYLjiAVIPPtRRRVJEOTP/Z";

const TutorCard = ({ id, name, subjects, year, rating, onStartChat, profileImage }) => {
  return (
    <div className="tutor-card-search">
      <div className="tutor-info-search">
        <div className="avatar-placeholder-search">
          <img 
            src={profileImage || DEFAULT_PROFILE_IMAGE} 
            // alt={`Avatar de ${name}`} 
            className="tutor-avatar" 
          />
        </div>
        <div>
          <h4>{name}</h4>
          <h4>{subjects.join(', ')}</h4> {/* Mostrar todas las materias */}
          <div className="stars">
            {'★'.repeat(rating) + '☆'.repeat(5 - rating)}
          </div>
        </div>
      </div>
      <button onClick={() => onStartChat(id)} className="chat-btn-search">Chat</button>
    </div>
  );
};

const FilterDropdown = ({ selectedSubject, setSelectedSubject }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${baseUrl}/api/courses`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        });
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <select
      value={selectedSubject}
      onChange={(e) => setSelectedSubject(e.target.value)}
      className="filter-dropdown"
    >
      <option value="">Seleccionar materia</option>
      {courses.map((course) => (
        <option key={course.course_code} value={course.namecourse}>
          {course.namecourse}
        </option>
      ))}
    </select>
  );
};

const TutorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const fetchTutors = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${baseUrl}/api/tutors`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          }
        });
        const data = await response.json();

        const tutorsWithImages = await Promise.all(
          data.map(async (tutor) => {
            try {
              const imageResponse = await fetch(`${baseUrl}/api/profile/avatar/${tutor.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
              });
              const imageData = await imageResponse.json();

              return {
                ...tutor,
                profileImage: imageData.success ? imageData.image : null
              };
            } catch {
              return { ...tutor, profileImage: null };
            }
          })
        );

        const formattedTutors = tutorsWithImages.map(tutor => ({
          id: tutor.id,
          name: tutor.username,
          subjects: tutor.courses.split(', '),
          year: tutor.year || 5,
          rating: Math.round(tutor.avg_rating),
          profileImage: tutor.profileImage
        }));

        setTutors(formattedTutors);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, []);

  const startChat = (tutorId) => {
    if (tutorId) {
      navigate('/chat', { state: { tutorId } });
    } else {
      console.error("Tutor ID is invalid. Cannot start chat.");
    }
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSubject = selectedSubject === '' || tutor.subjects.includes(selectedSubject);
    const matchesSearchTerm = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tutor.year.toString().includes(searchTerm);

    return matchesSubject && matchesSearchTerm;
  });

  return (
    <div className='outer-container-search'>
      <div className="sessions-container-search">
        <div className="tutors-page">
          <div className="header-search">
            <h2>Buscar Tutor</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Nombre, materia, año"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <FilterDropdown selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
            </div>
          </div>
          <div className="content">
            <div className="tutors-list">
              {filteredTutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  id={tutor.id}
                  name={tutor.name}
                  subjects={tutor.subjects}
                  year={tutor.year}
                  rating={tutor.rating}
                  profileImage={tutor.profileImage}
                  onStartChat={startChat}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorsPage;
