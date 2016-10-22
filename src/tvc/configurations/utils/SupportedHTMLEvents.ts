/**
 * Created by wjurasz on 14.09.16.
 */
/**
 * Event available in component.
 */
export class SupportedHTMLEvents {
    constructor(public value: string){}

    toString(){
        return this.value;
    }
    static Click = new SupportedHTMLEvents('click');
    static MouseOver = new SupportedHTMLEvents('mouseover');
    static MouseOut = new SupportedHTMLEvents('mouseout');
    static Non = new SupportedHTMLEvents('');
}