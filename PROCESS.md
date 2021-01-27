# Process

## Assumptions
1. Focus is on tech, not design
2. Server is not explicitly required
3. Authentication not required
4. Should demonstrate competency in:
    * git
    * npm
    * js, html, css
    * build tooling
    * React
    * testing (unit/component w/ e2e a plus)
    * Process
5. Demonstration of competency in scaffolding/SSG/SSR is bonus

## Framework Evaluation
1. Completely vanilla JS, Web Components, History API, etc.
    * **Pros:**
        * fun experiment
        * show grasp of fundamentals
        * less setup and tooling
    * **Cons:**
        * unrealistic and less relevant (no React)
        * longer development time
        * (probably) less learning
2. CRA or [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate) (add redux, redux-toolkit and/or rematch if necessary)
    * **Pros:**
        * familiarity
        * still relatively basic
    * **Cons:**
        * very little learning
        * client-side only
        * advanced features (routing, SSR, etc.) very manual to implement
3. Next.js
    * **Pros:**
        * familiarity
        * catch up on latest version & features
        * very feature rich (routing, SSG, SSR, etc.)
        * quick setup and development time
    * **Cons:**
        * complexity of large framework
        * opinionated with hard boundaries
        * maybe overkill
4. Gatsby
    * **Pros:**
        * fun / learning (have not used much)
        * feature rich
        * rich ecosystem of plugins, themes, etc.
        * quick setup & development time
    * **Cons:**
        * complexity of large framework
        * opinionated with hard boundaries
        * more ramp up / learning time required
        * maybe overkill
5. Other (Angular, Vue, Svelte, Elm)
    * Not considered due to time constraint and relevence (not React)

## Conclusion
1. Begin with basic HTML, CSS, and JS
    * keep it very basic (no server, probably no routing or history)
    * use webpack for bundling and dev server
2. Add basic unit tests
3. Convert to chosen framework
4. Refine styling
5. Further testing
6. Refine performance (SSR/SSG, caching)
7. End-to-end tests