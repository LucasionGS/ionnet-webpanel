import TextField from "./TextField.ts";

/**
 * A field is a single piece of data that can be stored in a node.
 * Fields are used to store content, such as text, images, and other data.
 * 
 * Each field will populate a spot in the data structure of a node's JSON output.
 */
export abstract class Field {
  /**
   * The unique name of the field. This is used to identify the field in the JSON output, and should be using camelCase.
   */
  public abstract uname: string;

  /**
   * The public name of the field. This is used to display the field in the admin interface.
   */
  public abstract name: string;

  public static allFields: Field[] = [
    new TextField
  ];
}