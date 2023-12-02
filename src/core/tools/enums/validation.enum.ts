 

export class RegexClass {
    public static readonly ALPHANUMERIC = /^[a-z0-9 -.:,wığüşöçĞÜŞÖÇİ/]+$/i; 
    public static readonly ADDRESS = /^[a-z0-9 .,wığüşöçĞÜŞÖÇİ/:-]+$/i;
    public static readonly PHONE = /^[0-9 +()]+$/i; 
    public static readonly XSS = new RegExp(/^.*[<>{}].*$/s);
    public static readonly PASSWORD = /(?=.*\d)(?=.*\W+)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    public static readonly SPECIAL_CHARACTERS = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
}

