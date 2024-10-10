import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    inputBotaoEInformacao: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputECamera: {
      alignItems: 'left',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    logo: {
      height: 32,
      width: "55%",
      marginTop: "15%",
      marginBottom: "7%",
      marginLeft: "3%"
    },
    input: {
      height: 40,
      width: "95%",
      borderColor: "black",
      borderWidth: 1,
      marginBottom: 20,
      borderRadius: 5,
      borderWidth: 2,
      fontSize: 21,
      padding: "1.3%"
    },
    logoCamera: {
      height: 40,
      width: 40,
      padding: "5%",
      marginRight: 5,
    },
    botao: {
      width: "95%",
      backgroundColor: "red",
      borderRadius: 5,
      padding: "2.5%",
    },
    textoBotao: {
      color: "white",
      textAlign: "center",
      fontSize: 18,
    },
    caixaDeInformacao: {
      height: "35%",
      width: "95%",
      marginTop: "5%",
      borderWidth: 1,
      borderColor: "red",
      borderWidth: 2,
      borderRadius: 5,
      padding: "5%",
      fontSize: 20,
      textAlign: "center",
    },
    fecharCamera: {
      color: "white",
      fontSize: 23,
      textAlign: "center",
      backgroundColor: "red",
      padding: "0.5%",
    },
});

export default styles