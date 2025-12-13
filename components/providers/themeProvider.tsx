
import { ThemeProvider as NextThemeProvider } from "next-themes"

const ThemeProvider = ({ children, ...props }: { children: React.ReactNode, props: any }) => {
    return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}