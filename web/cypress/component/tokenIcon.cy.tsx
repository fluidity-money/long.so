import { TokenIcon } from "@/components/TokenIcon";
import Token from "@/assets/icons/token.svg";

describe("customized default <TokenIcon/>", () => {
  beforeEach(() => {
    cy.mount(<TokenIcon className="size-[30px]" />);
  });
  it("customized render should use image", () => {
    cy.dataCy("token-icon-image");
  });

  it("customized render width should be 30px of width and height", () => {
    cy.dataCy("token-icon-image").should("be.visible");

    cy.dataCy("token-icon-image")
      .invoke("width")
      .then((width) => {
        expect(width).to.equal(30);
      });

    cy.dataCy("token-icon-image")
      .invoke("height")
      .then((height) => expect(height).to.equal(30));
  });
});

describe("customized Image <TokenIcon src={Token}/>", () => {
  beforeEach(() => {
    cy.mount(<TokenIcon src={Token} className="size-[30px]" />);
  });
  it("customized render should use image", () => {
    cy.dataCy("token-icon-image");
  });

  it("customized render should be 30px of width and height", () => {
    cy.dataCy("token-icon-image").should("be.visible");

    cy.dataCy("token-icon-image")
      .invoke("width")
      .then((width) => {
        expect(width).to.equal(30);
      });

    cy.dataCy("token-icon-image")
      .invoke("height")
      .then((height) => expect(height).to.equal(30));
  });
});
