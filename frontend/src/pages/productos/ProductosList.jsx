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
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const ProductosList = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [stockBajoFiltro, setStockBajoFiltro] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/categorias');
        setCategorias(response.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let url = `/productos?pagina=${page + 1}&limite=${rowsPerPage}`;
        
        if (searchTerm) {
          url += `&buscar=${searchTerm}`;
        }
        
        if (categoriaFiltro) {
          url += `&categoria=${categoriaFiltro}`;
        }
        
        if (stockBajoFiltro) {
          url += '&stock_bajo=true';
        }
        
        const response = await api.get(url);
        
        setProductos(response.data.data);
        setTotalRows(response.data.meta.total_registros);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar los productos. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [page, rowsPerPage, searchTerm, categoriaFiltro, stockBajoFiltro]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleCategoriaFilterChange = (event) => {
    setCategoriaFiltro(event.target.value);
    setPage(0);
  };

  const handleStockBajoFilterChange = () => {
    setStockBajoFiltro(!stockBajoFiltro);
    setPage(0);
  };

  const handleDeleteClick = (producto) => {
    setProductoToDelete(producto);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/productos/${productoToDelete.id}`);
      
      setSnackbar({
        open: true,
        message: 'Producto eliminado correctamente',
        severity: 'success'
      });
      
      // Actualizar la lista de productos
      const updatedProductos = productos.filter(p => p.id !== productoToDelete.id);
      setProductos(updatedProductos);
      
      setDeleteDialogOpen(false);
      setProductoToDelete(null);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      
      setSnackbar({
        open: true,
        message: 'Error al eliminar el producto',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>
      
      {/* Barra de herramientas */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Buscar productos"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: '200px' }}>
          <InputLabel id="categoria-filter-label">Filtrar por Categoría</InputLabel>
          <Select
            labelId="categoria-filter-label"
            value={categoriaFiltro}
            onChange={handleCategoriaFilterChange}
            label="Filtrar por Categoría"
          >
            <MenuItem value="">Todas las categorías</MenuItem>
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Chip
          label="Stock Bajo"
          color={stockBajoFiltro ? "error" : "default"}
          onClick={handleStockBajoFilterChange}
          icon={<WarningIcon />}
        />
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/productos/nuevo')}
        >
          Nuevo Producto
        </Button>
      </Box>
      
      {/* Tabla de productos */}
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Precio Compra</TableCell>
                  <TableCell align="right">Precio Venta</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Cargando productos...
                    </TableCell>
                  </TableRow>
                ) : productos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  productos.map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>{producto.codigo}</TableCell>
                      <TableCell>{producto.nombre}</TableCell>
                      <TableCell>{producto.categoria?.nombre || 'Sin categoría'}</TableCell>
                      <TableCell align="right">{formatCurrency(producto.precio_compra)}</TableCell>
                      <TableCell align="right">{formatCurrency(producto.precio_venta)}</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          color: producto.stock_actual <= producto.stock_minimo ? 'error.main' : 'inherit',
                          fontWeight: producto.stock_actual <= producto.stock_minimo ? 'bold' : 'normal'
                        }}
                      >
                        {producto.stock_actual}
                        {producto.stock_actual <= producto.stock_minimo && (
                          <WarningIcon 
                            color="error" 
                            fontSize="small" 
                            sx={{ ml: 1, verticalAlign: 'middle' }} 
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={producto.activo ? "Activo" : "Inactivo"} 
                          color={producto.activo ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary" 
                          onClick={() => navigate(`/productos/editar/${producto.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteClick(producto)}
                          disabled={!user || user.rol !== 'administrador'}
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
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalRows}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </Paper>
      )}
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar el producto "{productoToDelete?.nombre}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificaciones */}
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

export default ProductosList;