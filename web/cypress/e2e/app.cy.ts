describe("Navigation", () => {
  it("should navigate to the home page", () => {
    // Start from the home page
    cy.visit("/");

    // logo homepage link should be visible after mount
    cy.get('a[href*="/"]').should("be.visible");
  });
});
