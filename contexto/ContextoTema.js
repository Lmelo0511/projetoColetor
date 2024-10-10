import { createContext } from "react";
import { useState } from "react";
import axios from "axios";

export const ContextoTema = createContext({});

const TemaProvider = ({children}) => {

  const [codigo, setCodigo] = useState("");
  const [op, setOP] = useState("");
  const [popid, setPOPID] = useState("");
  const [popidexterno, setPOPIDEXTERNO] = useState("");
  const [cor, setCor] = useState("white");
  const [corop, setCorOP] = useState("white");
  const [corpopid, setCorPOPid] = useState("white");
  const [corpopidexterno, setCorPOPidExterno] = useState("white");
  const [focado, setFocado] = useState(true)
  const [Opfocado, setOPFocado] = useState(true)
  const [popIdfocado, setPopIdFocado] = useState(true);

  const defineFocoCodigo = () => {
    if(codigo){
      setFocado(true);
    } else {
      setFocado(false);
    }
  }

  const defineFocoOP = () => {
    if(op){
      setOPFocado(true)
    } else{
      setOPFocado(false)
    }
  }

  const defineFocoPopId = () => {
    if(popid){
      setPopIdFocado(true);
    } else {
      setPopIdFocado(false);
    }
  }

  const verificandoCodigoAutomatico = (codigo) => {
    setCodigo(codigo);
    if(codigo.length > 0){
      axios.post('http://10.0.2.2:8081/api/verifica-codigo', { codigo })
      .then(response => {
        if (response.data.existe) {
          Alert.alert("NFe válido!", `Descrição: ${response.data.descricao}`);
          setCor("#00FF7F");
          setFocado(true);
        } else {
          Alert.alert("NFe inválida!", "A NFe não foi encontrada.");
          setCor("#FF7F50");
          setFocado(false);
        }
      })
      .catch(error => {
        console.error('Erro na verificação da NFe!', error);
        Alert.alert("Erro", "Ocorreu um erro ao verificar a NFe.");
      });
    }
    setCor("white")
  }

  const verificandoOpAutomatico = (op) => {
    setOP(op);
    if(op.length > 0){
      axios.post('http://10.0.2.2:8081/api/verifica-codigo', { op })
      .then(response => {
        if (response.data.existe) {
          Alert.alert("OP válida!", `Cod. Produto: ${response.data.op}\nQuanditade: ${response.data.quantidade}`);
          setCorOP("#00FF7F");
          setOPFocado(true);
        } else {
          Alert.alert("OP inválida!", "A OP não foi encontrado.");
          setCorOP("#FF7F50");
          setOPFocado(false);
        }
      })
      .catch(error => {
        console.error('Erro na verificação da OP!', error);
        Alert.alert("Erro", "Ocorreu um erro ao verificar a OP.");
      });
    }
    setCorOP("white")
  }

  const verificandoPOPIDAutomatico = (popid) => {
    setPOPID(popid);
    if(popid.length > 0){
      axios.post('http://10.0.2.2:8081/api/verifica-codigo', { popid })
      .then(response => {
        if (response.data.existe) {
          Alert.alert("POPID válido!", `POPid: ${response.data.popid}`);
          setCorPOPid("#00FF7F");
          setPopIdFocado(true);
        } else {
          Alert.alert("POPid inválido!", "O POPid não foi encontrado.");
          setCorPOPid("#FF7F50");
          setPopIdFocado(false);
        }
      })
      .catch(error => {
        console.error('Erro na verificação do POPid!', error);
        Alert.alert("Erro", "Ocorreu um erro ao verificar o POPid.");
      });
    }
    setCorPOPid("white")
  }

  const verificandoPopIds = (popidexterno) => {
    setPOPIDEXTERNO(popidexterno)
    if (popid.length > 0 && popidexterno.length > 0) {
      if (popid === popidexterno) {
        Alert.alert("Carregamento Liberado!");
        Alert.alert("POPid`s corretos!");
        setCorPOPidExterno("#00FF7F");
      } else {
        Alert.alert("Os POPid`s não se conferem! Tente de novo");
        setCorPOPidExterno("#FF7F50")
      }
    } else {
      Alert.alert("Erro", "Ambos os campos POPid precisam ser preenchidos.");
    }
    setCorPOPidExterno("white")
  };

  const limpandoCampos = () => {
    setCodigo("");
    setCor("white");
    setOP("");
    setCorOP("white");
    setPOPID("");
    setCorPOPid("white");
    setPOPIDEXTERNO("");
    setCorPOPidExterno("white");
    setDados("");
    setDadosOp("");
  };

  return (
    <ContextoTema.Provider value={{ 

      codigo, op, popid, popidexterno, cor, corop, 
      corpopid, corpopidexterno, opEditavel, popidEditavel, 
      popidExternoEditavel, focado, Opfocado, popIdfocado,
      defineFocoCodigo, defineFocoOP, defineFocoPopId,
      verificandoCodigoAutomatico, verificandoOpAutomatico, 
      verificandoPOPIDAutomatico, verificandoPopIds, 
      limpandoCampos,  

    }}>{children}</ContextoTema.Provider>
  )
}

export default TemaProvider;
