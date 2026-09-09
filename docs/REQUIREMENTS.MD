Okay, my client was inspired by this website and wants me to build a clone of it: https://reliancepartners.com/

However, we **do not need to clone the entire website**. The requirements are:

* A **Home page**
* Four navigation items:

  1. **Our Difference**
  2. **Services** (instead of Resources)
  3. **Get a Quote** — with a custom form
  4. **Contact Us**

Please also verify these requirements against all the documents provided to you to make sure everything is correct.

### What I want you to do

First, **deeply crawl and analyze the entire Reliance Partners website**.

Start with the **Home page** and examine it section by section, line by line. Identify:

* How many sections the page contains
* All the content and text used in each section
* The layout and structure of every section
* The positioning and hierarchy of elements
* Images, cards, buttons, CTAs, forms, etc.
* How each section is visually structured
* Any important interactions or UI behavior
* The overall page flow

Then create a folder named:

`reliance_clone`

Inside this folder, create a `home.md` file.

In `home.md`, document the **complete Home page layout** and create a clear diagram representing the structure and flow of every section. The diagram should contain enough information that another developer/designer can use it as a blueprint for recreating the page.

### Navigation Pages

Do the same analysis for **every page linked from the four navigation items**.

For each page:

1. Deeply inspect the page.
2. Analyze every section from top to bottom.
3. Document all relevant content.
4. Analyze the layout and structure.
5. Identify components, cards, CTAs, forms, images, and other UI elements.
6. Create a layout diagram showing the complete page structure.
7. Create a separate `.md` file for that page inside the `reliance_clone` folder.

The goal is to create a **complete layout and content reference/documentation**, not to implement the website yet.

I will use these documented layouts and pages as the **base/reference for building the clone later**.

### Get a Quote Page

For **Get a Quote**, do not simply copy the existing three-tab quote structure from the original website.

Instead, create the documentation for a **single customized quote form** containing the following fields:

* **DOT Number** — users should only be able to enter numbers.
* **Company Name**
* **Garaging Address**
* **Company Owner Name**
* **Email**
* **Phone Number**
* **Vehicle VIN Numbers** — provide input fields for at least **5 vehicles**.
* **Coverages Needed** — users can describe the coverage they need.
* **Attachments** — users should be able to upload:

  * Driver CDLs
  * Driver MVRs
  * Owner CDL
  * Owner MVR
  * IFTAs for the last 4 quarters
  * Loss runs for prior years
  * Vehicle Excel list, if they have more than 5 vehicles

If a customer has more than five vehicles, they should be able to attach an **Excel file containing the complete vehicle list**.

Please document the complete layout and user flow of this customized **Get a Quote** form in the same way as the other pages.

### Final Deliverable

Create the following structure:

`reliance_clone/`

Inside it, include:

* `home.md`
* One `.md` file for **Our Difference**
* One `.md` file for **Services**
* One `.md` file for **Get a Quote**
* One `.md` file for **Contact Us**
* Any additional `.md` files required for linked/sub-pages that are part of these sections

Each Markdown file should contain:

1. Page overview
2. Complete section-by-section breakdown
3. Content/text
4. Layout structure
5. Component breakdown
6. Visual hierarchy
7. CTA/button details
8. Image/media requirements
9. User interactions where applicable
10. A clear **page layout diagram**
11. Any important implementation notes

**Do not start coding the clone yet.** The first task is to thoroughly analyze the reference website and produce this documentation so that we have a solid blueprint for the actual implementation.
