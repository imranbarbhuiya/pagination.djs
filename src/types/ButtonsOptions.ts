import { ButtonOptions } from "./ButtonOptions";

//TODO: add docs to describe interface

export interface ButtonsOptions {
  /**
   * The first button of the pagination row
   */
  first: ButtonOptions;
  /**
   * The previous button of the pagination row
   */
  prev: ButtonOptions;
  /**
   * The next button of the pagination row
   */
  next: ButtonOptions;
  /**
   * The last button of the pagination row
   */
  last: ButtonOptions;
}
