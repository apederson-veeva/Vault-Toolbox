import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Center,
    Flex,
    FlexProps,
    Grid,
    Heading,
    Spinner,
    Stack,
    StackProps,
    Text,
} from '@chakra-ui/react';
import { query } from '../services/ApiService';
import { getVaultName } from '../services/SharedServices';
import ApiErrorMessageCard from '../components/shared/ApiErrorMessageCard';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Metrics {
    totalActiveUsers: number | null;
    newUsers: number | null;
    newDocuments: number | null;
    newWorkflows: number | null;
    documentViews: number | null;
    monthlyLogins: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getMonthBounds(yearMonth: string): { start: string; end: string } {
    const [year, month] = yearMonth.split('-').map(Number);
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    return {
        start: start.toISOString().replace('T', ' ').slice(0, 19),
        end: end.toISOString().replace('T', ' ').slice(0, 19),
    };
}

async function runVql(vql: string): Promise<number | null> {
    const { queryResponse } = await query(vql);
    if (queryResponse?.responseStatus === 'SUCCESS') {
        return queryResponse?.data?.[0]?.count ?? 0;
    }
    return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DomainAdminPage() {
    const today = new Date();
    const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    const [targetMonth, setTargetMonth] = useState<string>(defaultMonth);
    const [metricsLoading, setMetricsLoading] = useState(false);
    const [metricsError, setMetricsError] = useState('');
    const [metrics, setMetrics] = useState<Metrics | null>(null);

    const vaultName = getVaultName();

    const fetchMetrics = useCallback(async () => {
        if (!targetMonth) return;
        setMetricsLoading(true);
        setMetricsError('');
        setMetrics(null);

        const { start, end } = getMonthBounds(targetMonth);

        try {
            const [totalActiveUsers, newUsers, newDocuments, newWorkflows, documentViews, monthlyLogins] =
                await Promise.all([
                    runVql(`SELECT count(id) FROM user__sys WHERE status__v = 'active__v'`),
                    runVql(`SELECT count(id) FROM user__sys WHERE created_date__v >= '${start}' AND created_date__v < '${end}'`),
                    runVql(`SELECT count(id) FROM documents WHERE created_date__v >= '${start}' AND created_date__v < '${end}'`),
                    runVql(`SELECT count(id) FROM workflow__sys WHERE start_date__v >= '${start}' AND start_date__v < '${end}'`),
                    runVql(`SELECT count(id) FROM doc_audit_history__sys WHERE action_type__sys = 'View' AND timestamp__sys >= '${start}' AND timestamp__sys < '${end}'`),
                    runVql(`SELECT count(id) FROM sys_audit_history__sys WHERE action_type__sys = 'Login' AND timestamp__sys >= '${start}' AND timestamp__sys < '${end}'`),
                ]);

            setMetrics({ totalActiveUsers, newUsers, newDocuments, newWorkflows, documentViews, monthlyLogins });
        } catch (e: any) {
            setMetricsError(e?.message ?? 'Error fetching metrics.');
        } finally {
            setMetricsLoading(false);
        }
    }, [targetMonth]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    const metricCards: { label: string; value: number | null; sub: string }[] = metrics
        ? [
              { label: 'Total Active Users', value: metrics.totalActiveUsers, sub: 'All-time' },
              { label: 'New Users', value: metrics.newUsers, sub: targetMonth },
              { label: 'Monthly Logins (MAU)', value: metrics.monthlyLogins, sub: targetMonth },
              { label: 'New Documents', value: metrics.newDocuments, sub: targetMonth },
              { label: 'New Workflows Started', value: metrics.newWorkflows, sub: targetMonth },
              { label: 'Document Views', value: metrics.documentViews, sub: targetMonth },
          ]
        : [];

    return (
        <Flex {...PageFlexStyle}>
            <Stack {...PageStackStyle}>
                {/* Header */}
                <Heading size='xl' color='veeva_orange_color_mode'>
                    Vault Health Check
                </Heading>
                {vaultName && (
                    <Text color='gray.500' fontSize='sm'>
                        {vaultName}
                    </Text>
                )}

                {/* Month Picker */}
                <Box>
                    <Text fontSize='xs' fontWeight='semibold' color='gray.500' mb={1} textTransform='uppercase'>
                        Month Starting
                    </Text>
                    <input
                        type='month'
                        value={targetMonth}
                        onChange={(e) => setTargetMonth(e.target.value)}
                        style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E0',
                            fontSize: '14px',
                            outline: 'none',
                        }}
                    />
                </Box>

                {/* Errors */}
                {metricsError && <ApiErrorMessageCard content='Vault Metrics' errorMessage={metricsError} />}

                {/* Metrics Grid */}
                {metricsLoading && (
                    <Center paddingY={10}>
                        <Spinner size='xl' color='veeva_orange_color_mode' />
                    </Center>
                )}

                {!metricsLoading && metrics && (
                    <Grid templateColumns='repeat(auto-fill, minmax(200px, 1fr))' gap={4} width='100%'>
                        {metricCards.map((card) => (
                            <Box
                                key={card.label}
                                bg='white'
                                borderRadius='lg'
                                padding={5}
                                boxShadow='md'
                                borderTop='3px solid'
                                borderColor='veeva_orange_color_mode'
                                _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)', transition: 'all 0.2s' }}
                                transition='all 0.2s'
                            >
                                <Text fontSize='xs' fontWeight='semibold' color='gray.500' textTransform='uppercase' mb={2}>
                                    {card.label}
                                </Text>
                                <Text fontSize='3xl' fontWeight='bold' color='gray.700'>
                                    {card.value === null ? '—' : card.value.toLocaleString()}
                                </Text>
                                <Text fontSize='xs' color='gray.400' mt={1}>
                                    {card.sub}
                                </Text>
                            </Box>
                        ))}
                    </Grid>
                )}
            </Stack>
        </Flex>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PageFlexStyle: FlexProps = {
    minHeight: '100vh',
    align: 'flex-start',
    justify: 'center',
    backgroundColor: 'veeva_light_gray_color_mode',
    boxShadow: 'inset -5px 0 8px -8px rgba(0,0,0,0.3), inset 5px 0 8px -8px rgba(0,0,0,0.3)',
};

const PageStackStyle: StackProps = {
    gap: 6,
    marginX: 'auto',
    maxWidth: '90%',
    paddingY: 12,
    paddingX: 6,
    width: '100%',
};
