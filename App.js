//Importando as bibliotecas do ReactJS e o React-Native
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import styles from "./styles/styles";
import { 
  Text, 
  TextInput, 
  View,
  Alert,
  Image,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

/*Fazendo a conexão com a API por meio da biblioteca axios 
e uma função para enviar ao servidor o valor armazenado na 
variavel codigo e fazendo as verificações necessarias*/
const App = () => {

  const [data, setData] = useState([]);
  
  useEffect(() => {
    axios.get('http://10.50.1.124:8081/api/data')
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error('Houve um erro ao buscar os dados!', error);
    });
  }, []);
  
  const [codigo, setCodigo] = useState("");
  const [op, setOP] = useState({op: ''});
  const [quantidade, setQuantidade] = useState({quantidade: '0'});
  const [popid, setPOPID] = useState("");
  const [popidexterno, setPOPIDEXTERNO] = useState("");
  const [cor, setCor] = useState("white");
  const [corop, setCorOP] = useState("white");
  const [corpopid, setCorPOPid] = useState("white");
  const [corpopidexterno, setCorPOPidExterno] = useState("white");
  const [popIdValido, setPopIdValido] = useState(true);
  const [campoHabilitado, setCampoHabilitado] = useState(false);
  const [validaPopId, setValidaPopId] = useState(true);
  const [validaCoidgo, setValidaCodigo] = useState(true);
  const campoPopId = useRef(null);
  const campoOp = useRef(null);
  const campoCodigo = useRef(null);
  
  var str = popid
  var popidRes = (str.substring(2, 6) + str.substring(8, 14))
  
  var str2 = popidexterno
  var popidRes2 = (str2.substring(2, 8) + str2.substring(10, 14));

  var str3 = codigo
  var chaveRes = (str3.substring(25, 34))

  console.log(chaveRes);
  
  const focoNoPopId = () => {
    if (campoPopId && campoPopId.current){
      campoPopId.current.focus();
    }
  };
  
  const focoNaOp = () => {
    if(campoOp && campoOp.current){
      campoOp.current.focus();
    }
  }
  
  const focoNoCodigo = () => {
    if(campoCodigo && campoCodigo.current){
      campoCodigo.current.focus();
    }
  }
  
  const escondeTeclado = () => {
    Keyboard.dismiss();
  };
  
  const envioPopId = () => {
    if(popIdValido){
      focoNoPopId();
    } else {
      Alert.alert("Preencha um PopId Válido.");
    }
  }
  
  const envioOp = () => {
    if (popidexterno) {
      focoNaOp();
    } else {
      Alert.alert("Por favor, preencha uma OP válida.");
    }
  
    if(op){
      focoNoCodigo();
    }
  }
  
  const envioCodigo = () => {
    if (codigo) {
      escondeTeclado();
    } else {
      Alert.alert("Por favor, preencha uma NFe válida.");
    }
  }
  
  const verificandoCodigoAutomatico = async(codigo) => {
    setCodigo(codigo);
    if(codigo.length > 0){
      try{
        const response = await axios.post('http://10.50.1.124:8081/api/verifica-codigo', { codigo })
        if (response.data.existe) {
          //Alert.alert("NFe válido!", `Descrição: ${response.data.descricao}`);
          setValidaCodigo(true);
        } else {
          Alert.alert("NFe!", "A NFe não foi encontrado.");
          setCor("#FF7F50");
        }

        console.log(validaCoidgo);
        if(validaCoidgo){
          const resposta = await axios.get(`http://10.50.1.124:8081/api/nota/${codigo}`);
          const data = resposta.data;
          console.log(resposta);
          console.log(data);
          if (data.length > 0 && data[0].F2_CHVNFE) {
            const nfe = data[0].F2_CHVNFE.trim();
            const valor1 = codigo
            if (nfe === valor1) {
              setCor("#00FF7F");
            } else {
              Alert.alert("NFe não pertence ao produto.");
              setCor("#FF7F50");
            }
          }
        }

        const resposta = await axios.get(`http://10.50.1.124:8081/api/nota/${codigo}`);
        const data = resposta.data;
        const item = {
          ordemProducao: data[0].P12_NUMOP.trim(),
          nota: data[0].F2_DOC,
          itemNota: data[0].D2_ITEM, 
          PopId: data[0].P12_POPID,
          cu: data[0].P12_IDICLI,
          desc: data[0].B1_COD,
        }
        console.log(item.ordemProducao)
        console.log(item.nota);
        console.log(item.itemNota);
        console.log(item.PopId);
        console.log(item.cu);
        console.log(item.desc);
        const enviandoDados = await axios.post('http://10.50.1.124:8081/api/envia-dados', item)
        console.log('Dados enviados', enviandoDados);

        const nota = data[0].F2_DOC;

        const verificaNotaNoBanco = await axios.get(`http://10.50.1.124:8081/api/verifica-nota/${nota}`);

        if (verificaNotaNoBanco.data.existe) {
          console.log('Nota já lida');
        }

      } catch (error) {
        console.error('Erro na verificação da NFe ou no envio!', error);
        Alert.alert("Erro", "Ocorreu um erro durante o processo.");
        setCampoHabilitado(false);
      }
    }
  }
  
    
  const verificandoOpAutomatico = async(op) => {
    console.log(op);
    if(op.length > 0){
      try{
        const response = await axios.post('http://10.50.1.124:8081/api/verifica-codigo', { op })
        if (response.data.existe) {
          setOP({
            op: response.data.op,
          });
          setQuantidade({
            quantidade: response.data.quantidade,
          })
          setValidaPopId(true);
        } else {
          Alert.alert("OP inválida!", "A OP não foi encontrado.");
          setCorOP("#FF7F50");
        }
        
        console.log(validaPopId);
        if(validaPopId){
          const resposta = await axios.get(`http://10.50.1.124:8081/api/data/${op}`);
          const data = resposta.data;
          console.log(resposta);
          console.log(data);
          if (data.length > 0 && data[0].P12_POPID) {
            const popId = data[0].P12_POPID.trim();
            const valor1 = str.substring(8, 14);
            if (popId === valor1) {
              setCorOP("#00FF7F");
            } else {
              Alert.alert("PopId não pertence a OP.");
              setCorOP("#FF7F50");
            }
          }
        }
      } catch (error) {
        console.error('Erro na verificação da OP ou no envio!', error);
        Alert.alert("Erro", "Ocorreu um erro durante o processo.");
        setCampoHabilitado(false);
      }
    }
  }
  
  /*const verificandoPOPIDAutomatico = (popidRes) => {
    setPOPID(popidRes);
    if(popidRes.length > 6){
      axios.post('http://10.50.1.22:8081/api/verifica-codigo', { popid: popidRes })
      .then(response => {
        if (response.data.existe) {
          Alert.alert("POPID válido!", `POPid: ${response.data.popidRes}`);
          setCorPOPid("#00FF7F");
          setPopIdValido(true);
          setCampoHabilitado(true);
        } else {
          Alert.alert("POPid inválido!", "O POPid não foi encontrado.");
          setCorPOPid("#FF7F50");
          setPopIdValido(false);
          setCampoHabilitado(false);
        }
      })
      .catch(error => {
        console.error('Erro na verificação do POPid!', error);
        Alert.alert("Erro", "Ocorreu um erro ao verificar o POPid.");
        setPopIdValido(false);
        setCampoHabilitado(false);
      });
    }
    setCorPOPid("white")
  }*/
  
  const validandoPopId = (popidRes) => {
    setPOPID(popidRes);
    if(popidRes >= 10){
      //Alert.alert("POPID + C.U válido!", `POPid: ${popidRes}`);
      setCorPOPid("#00FF7F");
      setPopIdValido(true);
      setCampoHabilitado(true);
    } else {
      Alert.alert("Erro", "Ocorreu um erro ao verificar o POPid.");
      setCorPOPid("#FF7F50");
      setPopIdValido(false);
      setCampoHabilitado(false);
    }
  }
  
  const verificandoPopIds = (popidRes, popidRes2) => {
    setPOPID(popidRes);
    setPOPIDEXTERNO(popidRes2);
    const str = popidRes; 
    const str2 = popidRes2;
    const valor1 = str.substring(2, 6); 
    const valor2 = str2.substring(10, 14); 
  
    if (valor1 === valor2) {
      //Alert.alert("POPids corretos!");
      setCorPOPidExterno("#00FF7F");
      setPopIdValido(true);
    } else {
      Alert.alert("Os POPids não se conferem! Tente de novo");
      setCorPOPidExterno("#FF7F50");
      setPopIdValido(false);
    }
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
    setQuantidade('0');
  };
  
  return (
    <View style={styles.corpo}>
      <View style={styles.inputBotaoEInformacao}>
        <View style={styles.inputECamera}>
        <TextInput
            style={[styles.input,  {backgroundColor: corpopid}]}
            placeholder="   PopID Interno + C.U: "
            underlineColorAndroid="transparent"   
            value={popidRes}
            onChangeText={validandoPopId}     
            onSubmitEditing={envioPopId}
            returnKeyType="next"
          />
        </View>
        <View style={styles.inputECamera}>
        <TextInput
          style={[styles.input, { backgroundColor: corpopidexterno }]}
          placeholder="  PopID externo + C.U: "
          underlineColorAndroid="transparent"
          value={popidRes2}
          onChangeText={(text) => verificandoPopIds(popid, text)}
          onFocus={() => { if (!popid) campoPopId.current.blur(); }}
          onSubmitEditing={envioOp}
          disable={!campoHabilitado}
          editable={popIdValido}
          ref={campoPopId}
          returnKeyType="next"
        />
        </View>
        <View style={styles.inputECamera}>
          <TextInput
            style={[styles.input,  {backgroundColor: corop}]}
            placeholder="   Insira a OP: "
            underlineColorAndroid="transparent"   
            value={op}
            onChangeText={verificandoOpAutomatico}
            onFocus={() => { 
              if(!popidexterno){
                campoOp.current.blur(); 
              }
            }}
            editable={popIdValido}
            ref={campoOp}
            onSubmitEditing={envioOp}
            returnKeyType="next"
          />
        </View>
        <View style={styles.inputECamera}>
          <TextInput style={[styles.input, {backgroundColor: cor}]}
            placeholder="   Insira a NFe: "
            underlineColorAndroid="transparent"
            value={codigo}
            onChangeText={verificandoCodigoAutomatico}
            editable={popIdValido}
            ref={campoCodigo}
            onFocus={() => { 
              if(!op){
                campoCodigo.current.blur(); 
              }
            }}
            onSubmitEditing={envioCodigo}
            disable={!campoHabilitado}
            returnKeyType="done"
          />
        </View>
        <TouchableOpacity style={styles.botao} onPress={limpandoCampos}>
          <Text style={styles.textoBotao}>Reiniciar</Text>
        </TouchableOpacity>
        <Text style={styles.caixaDeInformacao}>
          {''}Desc. Produto: {op.op || 'Nenhuma OP encontrada'}
          {'\n\n\n\n'}Quantidade: {quantidade.quantidade}
        </Text>
      </View>
    </View>
  );
}

export default App;
