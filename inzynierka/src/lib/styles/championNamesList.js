export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#f5b800" : "#f5b800",
    color: "#f5f5f5",
    fontSize: "17px",
    cursor: "pointer", // Change cursor to pointer on hover
    transition: "all 150ms ease",
    boxShadow: "none", // Remove focus shadow
    "&:hover": {
      borderColor: "#f5b800",
      backgroundColor: "rgba(217,217,217,0.15)",
      // Keep border color constant on hover
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#f5f5f5", // Setting placeholder color
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "transparent",
    border: "1px solid #f5b800", // Color of the dropdown menu
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#131313" : "#131313", // Color of selected and non-selected options
    color: "#f5f5f5", // Text color of options
    "&:hover": {
      backgroundColor: "#696969",
      // Background color on hover
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
  // Custom scrollbar styles
  menuList: (provided) => ({
    ...provided,
    "&::-webkit-scrollbar": {
      width: "8px", // Width of the scrollbar
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#f5f5f5", // Scrollbar thumb color
      borderRadius: "4px", // Round edges of the thumb
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#131313", // Track color (remove white background)
    },
  }),
};

export const customStylesDuo = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(175, 175, 175, 0.15)",
    border: "none",
    color: "#f5f5f5",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 150ms ease",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "rgba(217,217,217,0.15)",
    },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "14px",
    backgroundColor: state.isSelected ? "#131313" : "#131313", // Ustawienie tła opcji
    color: "#f5f5f5",
    "&:hover": {
      backgroundColor: "#696969",
    },
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: "14px",
  }),
  menu: (base) => ({
    ...base,
    maxHeight: 150,
    backgroundColor: "transparent", // Dodane przeźroczyste tło
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#f5f5f5", // Setting placeholder color
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
  // Custom scrollbar styles
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "#131313", // Dodane tło dla listy menu
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#131313",
    },
  }),
};
