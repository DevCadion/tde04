import { useSQLiteContext } from "expo-sqlite";

export type ProductDatabase = {
  id: number;
  name: string;
  category: string;
  url: string;
};

export function useProductDatabase() {
  const database = useSQLiteContext();

  // Função para criar um novo produto
  async function create(data: Omit<ProductDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO products (name, category, url) VALUES ($name, $category, $url)"
    );

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $category: data.category,
        $url: data.url,
      });

      const insertedRowId = result.lastInsertRowId;
      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Função para buscar produtos pelo nome
  async function searchByName(name: string) {
    try {
      const query = "SELECT * FROM products WHERE name LIKE ?";
      const response = await database.getAllAsync<ProductDatabase>(
        query,
        [`%${name}%`]
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Função para atualizar um produto
  async function update(data: ProductDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE products SET name = $name, category = $category, url = $url WHERE id = $id"
    );

    try {
      await statement.executeAsync({
        $id: data.id,
        $name: data.name,
        $category: data.category,
        $url: data.url,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Função para remover um produto pelo ID
  async function remove(id: number) {
    const statement = await database.prepareAsync(
      "DELETE FROM products WHERE id = $id"
    );

    try {
      await statement.executeAsync({ $id: id });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  // Função para exibir um produto pelo ID
  async function show(id: number) {
    try {
      const query = "SELECT * FROM products WHERE id = ?";
      const response = await database.getFirstAsync<ProductDatabase>(query, [
        id,
      ]);

      return response;
    } catch (error) {
      throw error;
    }
  }
  async function searchByCategory(category: string) {
    try {
      const query = "SELECT * FROM products WHERE category = ?";
      const response = await database.getAllAsync<ProductDatabase>(query, [category]);
  
      console.log("Links encontrados:", response); // Verifique se os links estão sendo retornados corretamente
      return response;
    } catch (error) {
      console.log("Erro ao buscar por categoria:", error);
      throw error;
    }
  }

  return { create, searchByName, update, remove, show, searchByCategory };
}
