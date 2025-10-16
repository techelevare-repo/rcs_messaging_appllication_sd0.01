import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#4f7cff',
            light: '#7ba3ff',
            dark: '#2c5bcc'
        },
        secondary: {
            main: '#ff6b6b',
            light: '#ff8e8e',
            dark: '#cc5555'
        },
        background: {
            default: '#0b1020',
            paper: '#111933',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b0b0b0',
        },
        error: {
            main: '#ff6b6b',
        },
        warning: {
            main: '#ffa726',
        },
        success: {
            main: '#66bb6a',
        },
        info: {
            main: '#42a5f5',
        },
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    border: '1px solid #253056',
                    backgroundColor: '#111933',
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#1a2332',
                        '& fieldset': {
                            borderColor: '#253056',
                        },
                        '&:hover fieldset': {
                            borderColor: '#4f7cff',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#4f7cff',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
    },
});

export default theme;



