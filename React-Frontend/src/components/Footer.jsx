import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-(--color-light-ed)/50 bg-(--color-background)">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <p className="text-sm text-(--color-muted-foreground) text-center md:text-left leading-relaxed">
                        © {currentYear} GameVault. All rights reserved.
                    </p>
                </motion.div>

                <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Link
                        to="/terms"
                        className="text-sm text-(--color-muted-foreground) hover:underline underline-offset-4"
                    >
                        Terms
                    </Link>
                    <Link
                        to="/privacy"
                        className="text-sm text-(--color-muted-foreground) hover:underline underline-offset-4"
                    >
                        Privacy
                    </Link>
                    <Link
                        to="/contact"
                        className="text-sm text-(--color-muted-foreground) hover:underline underline-offset-4"
                    >
                        Contact
                    </Link>
                </motion.div>
            </div>
        </footer>
    );
}
