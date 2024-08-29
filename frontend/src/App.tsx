import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { backend } from 'declarations/backend';
import { Button, TextField, List, ListItem, ListItemText, ListItemIcon, CircularProgress, AppBar, Toolbar, Typography, Container } from '@mui/material';
import { ShoppingCart, Delete, Add } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

interface AppProps {
  authClient: AuthClient;
}

interface Item {
  id: bigint;
  name: string;
  icon: string | null;
}

const App: React.FC<AppProps> = ({ authClient }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const result = await backend.getItems();
      setItems(result);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: { itemName: string }) => {
    setLoading(true);
    try {
      const result = await backend.addItem(data.itemName, null);
      if ('ok' in result) {
        await fetchItems();
        reset();
      } else {
        console.error('Error adding item:', result.err);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: bigint) => {
    setLoading(true);
    try {
      const result = await backend.removeItem(id);
      if ('ok' in result) {
        await fetchItems();
      } else {
        console.error('Error removing item:', result.err);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authClient.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar position="static" className="bg-green-600">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Family Shopping List
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" className="mt-8">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
            <div className="flex items-center">
              <Controller
                name="itemName"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Add Item"
                    variant="outlined"
                    fullWidth
                    className="mr-2"
                  />
                )}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Add />}
              >
                Add
              </Button>
            </div>
          </form>
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <List>
              {items.map((item) => (
                <ListItem
                  key={Number(item.id)}
                  secondaryAction={
                    <Button
                      edge="end"
                      aria-label="delete"
                      onClick={() => removeItem(item.id)}
                    >
                      <Delete />
                    </Button>
                  }
                >
                  <ListItemIcon>
                    <ShoppingCart />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
            </List>
          )}
        </div>
      </Container>
    </div>
  );
};

export default App;
