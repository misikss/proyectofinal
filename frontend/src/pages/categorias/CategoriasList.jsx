import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const CategoriasList = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Cargar categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get('/categorias', {
          params: {
            pagina: page + 1,
            limite: rowsPerPage,
            buscar: search || undefined
          }
        });
        
        setCategorias(response.data.data || []);
        setTotalCategorias(response.data.meta?.total_registros || 0);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('Error al cargar las categorías. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategorias();
  }, [page, rowsPerPage, search]);

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar búsqueda
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  // Abrir diálogo de confirmación para eliminar
  const handleOpenDeleteDialog = (categoria) => {
    setCategoriaToDelete(categoria);
    setOpenDialog(true);
  };

  // Cerrar diálogo de confirmación
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCategoriaToDelete(null);
  };

  // Eliminar categoría
  const handleDeleteCategoria = async () => {
    try {
      await api.delete(`/categorias/${categoriaToDelete.id}`);
      
      // Actualizar lista de categorías
      setCategorias(categorias.filter(cat => cat.id !== categoriaToDelete.id));
      setTotalCategorias(prev => prev - 1);
      
      // Mostrar mensaje de éxito
      setSnackbar({
        open: true,
        message: 'Categoría eliminada correctamente',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
      setSnackbar({
        open: true,
        message: 'Error al eliminar la categoría',
        severity: 'error'
      });
    } finally {
      handleCloseDialog();
    }
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Categorías</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/categorias/nueva')}
        >
          Nueva Categoría
        </Button>
      </Box>
      
      {/* Buscador */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar categorías..."
        value={search}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
      
      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Tabla de categorías */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Cargando categorías...
                  </TableCell>
                </TableRow>
              ) : categorias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No se encontraron categorías
                  </TableCell>
                </TableRow>
              ) : (
                categorias.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell>{categoria.id}</TableCell>
                    <TableCell>{categoria.nombre}</TableCell>
                    <TableCell>{categoria.descripcion}</TableCell>
                    <TableCell>
                      <Chip
                        label={categoria.activo ? 'Activo' : 'Inactivo'}
                        color={categoria.activo ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/categorias/editar/${categoria.id}`)}
                        title="Editar"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(categoria)}
                        title="Eliminar"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Paginación */}
        <TablePagination
          component="div"
          count={totalCategorias}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar la categoría "{categoriaToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteCategoria} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para mensajes */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriasList;