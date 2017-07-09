import { StyleSheet } from "aphrodite";

const styles = StyleSheet.create({
  outerContainer: { fontFamily: "sans-serif" },
  innerContainer: {
    paddingTop: "10px 0 0 0",
    "@media (min-width: 767px)": {
      paddingLeft: "2rem",
      paddingRight: "2rem"
    }
  },
  divider: { marginTop: "0rem" },
  listing: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  }
});

export { styles };
