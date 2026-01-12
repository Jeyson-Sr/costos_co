import PresupuestoForm from '../features/presupuestos/components/presupuestos';
 import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Presupuestos',
        href: "/presupuestos",
    },
];

export default function Presupuestos() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Presupuestos" />
            <PresupuestoForm />
        </AppLayout>
    );
}
