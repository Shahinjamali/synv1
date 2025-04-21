declare module 'wowjs' {
  export class WOW {
    constructor(options?: {
      live?: boolean;
      boxClass?: string;
      animateClass?: string;
      offset?: number;
      mobile?: boolean;
    });
    init(): void;
  }
  export default WOW;
}
