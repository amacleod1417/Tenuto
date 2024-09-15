import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  messageAuthor: { fontWeight: "bold" },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    borderBottomColor: "#6c757d",
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderRadius: 0,
  },
  name: {
    backgroundColor: "#212529",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "center",
  },
  nameText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  title: {
    textAlign: "center",
    fontSize: 36,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    flexShrink: 0,
    marginVertical: 100,
  },
  timestamp: {
    color: "#6c757d",
  },
  input: {
    fontSize: 16,
    margin: 10,
    padding: 10,
    borderStyle: "solid",
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 5,
    height: 300,
    width: 300,
    color: "#465663",
  },
  buttonText: {
    color: "#465663",
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
    textDecorationLine: "underline",
    paddingBottom: 20,
  },
  button: {
    alignSelf: "center",
    alignContent: "center",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9E2DA",
    height: "100%",
  },
  logo: {
    fontFamily: "LibreBaskerville_400Regular",
    fontSize: 50,
    color: "#465663",
    padding: 10,
  },
  header: {
    fontFamily: "Poppins_700Regular",
    fontSize: 30,
    color: "#465663",
    paddingBottom: 20,
  },
  audioControl: {
    fontSize: 50,
    color: "#465663"
  }
});

export default styles;
