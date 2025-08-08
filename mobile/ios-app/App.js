import { View, Text, SafeAreaView } from 'react-native'

export default function App(){
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#F5F7FA' }}>
      <View style={{ padding:16 }}>
        <Text style={{ fontSize:22, fontWeight:'700', color:'#083E8C' }}>SEES-DTE (iOS)</Text>
        <Text style={{ marginTop:8 }}>Resumen pronto aquí…</Text>
      </View>
    </SafeAreaView>
  )
}
