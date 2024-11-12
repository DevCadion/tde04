import { Alert, FlatList, Image, Linking, Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/styles/colors';
import { Categories } from '@/components/categories';
import { Link } from '@/components/link';
import { Option } from '@/components/option';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { categories } from '@/utils/categories';
import { useProductDatabase, ProductDatabase } from '@/app/database/useProductDatabase'; // Importe as funções CRUD para SQLite

export default function Index() {
  const [showModal, setShowModal] = useState(false);
  
  const [link, setLink] = useState<ProductDatabase>({} as ProductDatabase);
  const [links, setLinks] = useState<ProductDatabase[]>([]);
  const [category, setCategory] = useState(categories[0].name);

  // Inclua a função searchByCategory aqui
  const { create, searchByName, update, remove, show, searchByCategory } = useProductDatabase(); // Agora incluindo searchByCategory

  async function getLinks() {
    try {
      // Filtra os links pela categoria selecionada
      const response = await searchByCategory(category);  // Alteração aqui
      console.log("Links encontrados:", response); // Adicione este log para verificar os dados
      setLinks(response); // Atualiza o estado com os links
    } catch (error) {
      Alert.alert("Erro", "Não foi possível listar os links");
      console.log("Erro ao buscar links:", error);
    }
  }

  function handleDetails(selected: ProductDatabase) {
    setShowModal(true);
    setLink(selected);
  }

  async function linkRemove() {
    try {
      await remove(link.id); // Remove o link pelo ID usando o SQLite
      await getLinks(); // Atualiza a lista de links
      setShowModal(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir");
      console.log(error);
    }
  }

  async function handleRemove() {
    Alert.alert("Excluir", "Deseja realmente excluir?", [
      { style: "cancel", text: "Não" },
      { text: "Sim", onPress: linkRemove },
    ]);
  }

  async function handleOpen() {
    try {
      await Linking.openURL(link.url);
      setShowModal(false);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o link");
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getLinks(); // Atualiza a lista de links ao focar no componente
    }, [category])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/logo.png")} style={styles.logo} />

        <TouchableOpacity onPress={() => router.navigate("/add")}>
          <MaterialIcons name="add" size={32} color={colors.green[300]} />
        </TouchableOpacity>
      </View>

      <Categories onChange={setCategory} selected={category} />

      <FlatList
        data={Array.isArray(links) ? links : []} // Garante que links é um array
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Link name={item.name} url={item.url} onDetails={() => handleDetails(item)} />
        )}
        style={styles.links}
        contentContainerStyle={styles.linksContent}
        showsVerticalScrollIndicator={false}
      />

<Modal transparent visible={showModal} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategory}>{link.category}</Text>

              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons name="close" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalLinkName}>{link.name}</Text>

            <Text style={styles.modalUrl}>{link.url}</Text>

            <View style={styles.modalFooter}>
              <Option name="Excluir" icon="delete" variant="secondary" onPress={handleRemove} />
              <Option name="Abrir" icon="language" onPress={handleOpen} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
