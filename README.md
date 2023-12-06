# Calendar App

This is a React application that allows you to create, view, and manage your calendar by adding and editing tasks for specific days. The calendar supports color-coded labels for visual distinction and task filtering.

## Key Features

- **Month Navigation:**
  - Convenient ability to browse past and future months.
- **Adding and Editing Tasks:**
  - Simple interface for adding new tasks or editing existing ones.
- **Color-Coded Labels:**
  - Each task can have its own color-coded label for easy distinction and filtering.
- **Search:**
  - Quickly search for tasks by title.
- **Export and Import:**
  - Conveniently save your data in JSON format and import it for easy work across different devices or backup.

## How to Use

1. **Navigation:**
   - Use navigation buttons (< and >) to browse the previous or next month.
   - Clicking on the current date opens the option to add tasks for that day.

2. **Adding Tasks:**
   - Double-click on a day to open the option to add a new task or edit an existing one.
   - Each task can have a title and a color-coded label.

3. **Filtering:**
   - Utilize filters to highlight specific color-coded labels and reduce the display of tasks.

4. **Export and Import:**
   - Save your data in JSON format using the "Export" button.
   - Load previously saved data using the "Import" button.

5. **Save as Image:**
   - Capture your calendar as an image using the "Save as Image" button.

## Technical Details

- **Framework:** Developed using the ***React*** library and ***Styled Components*** for styling.
- **State Management:** Uses local component state and ***Redux*** for tasks and labels.
