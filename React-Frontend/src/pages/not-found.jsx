import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 text-center text-(--color-foreground)">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <h1 className="text-7xl font-bold gradient-text">404</h1>
                <h2 className="text-3xl font-bold">Page Not Found</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Button asChild variant="gradient">
                    <Link to="/">Return Home</Link>
                </Button>
            </motion.div>
        </div>
    )
}