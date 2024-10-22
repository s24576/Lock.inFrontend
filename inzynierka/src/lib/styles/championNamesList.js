export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#2a2a2a", // Color of the select control
    borderColor: "#555", // Border color of the select control
    color: "#fff", // Text color inside the select control
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#2a2a2a", // Color of the dropdown menu
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#555" : "#2a2a2a", // Color of selected and non-selected options
    color: "#fff", // Text color of options
    "&:hover": {
      backgroundColor: "#555", // Background color on hover
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#fff", // Color of the selected option text
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  input: (provided) => ({
    ...provided,
    color: "white",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#555", // Background color of selected values
    color: "#fff", // Text color of selected values
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#fff", // Text color of the label of selected values
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#fff", // Text color of the remove icon
    "&:hover": {
      backgroundColor: "#ff0000", // Background color on hover
      color: "#fff", // Text color on hover
    },
  }),
};
