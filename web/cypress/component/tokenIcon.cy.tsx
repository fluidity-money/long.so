import { TokenIcon } from "@/components/TokenIcon";
import Token from "@/assets/icons/token.svg";

describe("default SVGR <TokenIcon />", () => {
  beforeEach(() => {
    cy.mount(<TokenIcon />);
  });
  it("default render should use svgr", () => {
    cy.dataCy("token-icon-svgr");
  });

  it("default render width should be 25px of width and height", () => {
    cy.dataCy("token-icon-svgr").should("be.visible");

    cy.dataCy("token-icon-svgr")
      .invoke("width")
      .then((width) => {
        expect(width).to.equal(25);
      });

    cy.dataCy("token-icon-svgr")
      .invoke("height")
      .then((height) => expect(height).to.equal(25));
  });
});

describe("customized SVGR <TokenIcon sizeMd={30} />", () => {
  beforeEach(() => {
    cy.mount(<TokenIcon sizeMd={30} />);
  });
  it("customized render should use svgr", () => {
    cy.dataCy("token-icon-svgr");
  });

  it("customized render width should be 30px of width and height", () => {
    cy.dataCy("token-icon-svgr").should("be.visible");

    cy.dataCy("token-icon-svgr")
      .invoke("width")
      .then((width) => {
        expect(width).to.equal(30);
      });

    cy.dataCy("token-icon-svgr")
      .invoke("height")
      .then((height) => expect(height).to.equal(30));
  });
});

describe("default Image <TokenIcon src={Token} />", () => {
  beforeEach(() => {
    cy.mount(<TokenIcon src={Token} />);
  });
  it("default render should use image", () => {
    cy.dataCy("token-icon-image");
  });

  it("default render should be 25px of width and height", () => {
    cy.dataCy("token-icon-image").should("be.visible");

    cy.dataCy("token-icon-image")
      .invoke("width")
      .then((width) => {
        expect(width).to.equal(25);
      });

    cy.dataCy("token-icon-image")
      .invoke("height")
      .then((height) => expect(height).to.equal(25));
  });
});

describe("customized Image <TokenIcon src={Token} sizeMd={30} />", () => {
  beforeEach(() => {
    cy.mount(<TokenIcon src={Token} sizeMd={30} />);
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
