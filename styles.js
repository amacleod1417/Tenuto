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
    textAlign: "right",
    fontSize: 20,
    color: "#465663",
    // maxWidth: "95%",
  },
  artist: {
    textAlign: "right",
    fontSize: 16,
    color: "#465663",
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
  smallLogo: {
    fontFamily: "LibreBaskerville_400Regular",
    fontSize: 20,
    color: "#465663",
    padding: 10,
    position: "absolute",
    bottom: 30,
    left: "40%",
  },
  header: {
    fontFamily: "Poppins_700Regular",
    fontSize: 30,
    color: "#465663",
    paddingBottom: 20,
    maxWidth: "80%",
    textAlign: "center",
  },
  subheader: {
    fontFamily: "Poppins_700Regular",
    fontSize: 20,
    color: "#465663",
    paddingBottom: 20,
  },
  audioControl: {
    fontSize: 40,
    color: "#465663"
  },
  song: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderColor: "#465663",
    borderStyle: "solid",
    backgroundColor: "#D1DADC",
    borderRadius: 10,
    height: 100,
    width: "80%",
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
  },
  songDetails: {
    alignSelf: "center",
    paddingLeft: 10,
    paddingRight: 10,
    flexShrink: 1,
  }
});

export default styles;
