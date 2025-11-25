export default function VqlQueryMetadata() {
    const supportedQueryFilterOperators = {
        Default: ['=', '!=', '<', '>', '<=', '>=', 'CONTAINS', 'LIKE'],
        String: ['=', '!=', 'LIKE', 'CONTAINS'],
        Number: ['=', '!=', '<', '>', '<=', '>=', 'CONTAINS'],
        Date: ['=', '!=', '<', '>', '<=', '>='],
        DateTime: ['=', '!=', '<', '>', '<=', '>=', 'CONTAINS'],
        Boolean: ['=', '!='],
        Picklist: ['=', '!=', 'CONTAINS'],
        Object: ['=', '!=', 'LIKE', 'CONTAINS'],
        ID: ['=', '!=', 'LIKE', 'CONTAINS'],
        Currency: ['=', '!=', '<', '>', '<=', '>=', 'CONTAINS'],
    };

    const booleanValues = ['true', 'false'];

    const matchedDocumentsQueryTarget = {
        queryTarget: 'matched_documents',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'edl_item_id__v',
                label: 'EDL Item ID',
                fieldType: 'ID',
            },
            {
                field: 'matching_doc_id__v',
                label: 'Matching Document ID',
                fieldType: 'String',
            },
            {
                field: 'major_version__v',
                label: 'Major Version',
                fieldType: 'String',
            },
            {
                field: 'minor_version__v',
                label: 'Minor Version',
                fieldType: 'String',
            },
            {
                field: 'created_by__v',
                label: 'Created By',
                fieldType: 'ID',
            },
            {
                field: 'modified_date__v',
                label: 'Last Modified Date',
                fieldType: 'String',
            },
            {
                field: 'modified_by__v',
                label: 'Modified By',
                fieldType: 'ID',
            },
            {
                field: 'include_in_total__v',
                label: 'Include In Total',
                fieldType: 'Boolean',
            },
            {
                field: 'version_is_locked__v',
                label: 'Version Is Locked',
                fieldType: 'Boolean',
            },
            {
                field: 'created_date__v',
                label: 'Created Date',
                fieldType: 'String',
            },
            {
                field: 'source__v',
                label: 'Source',
                fieldType: 'String',
            },
        ],
        // Relationships modeled after Retrieve Object Metadata response so utility functions can be shared
        relationships: [
            {
                relationship_name: 'matching_documents__vr',
                relationship_label: 'Matched Documents',
                relationship_type: 'reference_outbound',
                excludeIdField: true,
                object: {
                    name: 'documents',
                },
            },
            {
                relationship_name: 'edl_item__vr',
                relationship_label: 'EDL Item',
                relationship_type: 'reference_outbound',
                excludeIdField: true,
                object: {
                    name: 'edl_item__v',
                },
            },
        ],
    };

    const attachmentsQueryTarget = {
        queryTarget: 'attachments__sysr',
        objectAttachmentFields: [
            {
                field: 'attachment_id__sys',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'attachment_version__sys',
                label: 'Version',
                fieldType: 'Number',
            },
            {
                field: 'attachment_name__sys',
                label: 'Name',
                fieldType: 'String',
            },
            {
                field: 'file_name__sys',
                label: 'File Name',
                fieldType: 'String',
            },
            {
                field: 'description__sys',
                label: 'Description',
                fieldType: 'String',
            },
            {
                field: 'md5checksum__sys',
                label: 'MD5 Checksum',
                fieldType: 'String',
            },
            {
                field: 'latest_version__sys',
                label: 'Latest Version',
                fieldType: 'Boolean',
            },
            {
                field: 'modified_date__sys',
                label: 'Modified Date',
                fieldType: 'DateTime',
            },
            {
                field: 'modified_by__sys',
                label: 'Modified By',
                fieldType: 'Object',
            },
            {
                field: 'created_date__sys',
                label: 'Created Date',
                fieldType: 'DateTime',
            },
            {
                field: 'created_by__sys',
                label: 'Created By',
                fieldType: 'Object',
            },
            {
                field: 'format__sys',
                label: 'Format',
                fieldType: 'String',
            },
            {
                field: 'size__sys',
                label: 'Size',
                fieldType: 'Number',
            },
        ],
        documentAttachmentFields: [
            {
                field: 'document_id__sys',
                label: 'Document ID',
                fieldType: 'Number',
            },
            {
                field: 'document_version_id__sys',
                label: 'Document Versions',
                fieldType: 'String',
            },
            {
                field: 'attachment_id__sys',
                label: 'Attachment ID',
                fieldType: 'ID',
            },
            {
                field: 'attachment_version__sys',
                label: 'Attachment Version',
                fieldType: 'Number',
            },
            {
                field: 'file_name__sys',
                label: 'File Name',
                fieldType: 'String',
            },
            {
                field: 'description__sys',
                label: 'Description',
                fieldType: 'String',
            },
            {
                field: 'md5checksum__sys',
                label: 'MD5 Checksum',
                fieldType: 'String',
            },
            {
                field: 'latest_version__sys',
                label: 'Latest Version',
                fieldType: 'Boolean',
            },
            {
                field: 'modified_date__sys',
                label: 'Modified Date',
                fieldType: 'DateTime',
            },
            {
                field: 'created_date__sys',
                label: 'Created Date',
                fieldType: 'DateTime',
            },
            {
                field: 'format__sys',
                label: 'Format',
                fieldType: 'String',
            },
            {
                field: 'size__sys',
                label: 'Size',
                fieldType: 'Number',
            },
        ],
    };

    const documentRolesQueryTarget = {
        queryTarget: 'doc_role__sys',
        subQueryTarget: 'doc_roles__sysr',
        label: 'Document Roles',
        fields: [
            {
                field: 'role_name__sys',
                label: 'Role Name',
                fieldType: 'String',
            },
            {
                field: 'document_id',
                label: 'Document ID',
                fieldType: 'ID',
            },
            {
                field: 'user__sys',
                label: 'User',
                fieldType: 'Object',
            },
            {
                field: 'group__sys',
                label: 'Group',
                fieldType: 'Object',
            },
        ],
        // Relationships modeled after Retrieve Object Metadata response so utility functions can be shared
        relationships: [
            {
                relationship_name: 'user__sysr',
                relationship_label: 'User',
                relationship_type: 'reference_outbound',
                field: 'user__sys',
                object: {
                    name: 'user__sys',
                },
            },
            {
                relationship_name: 'group__sysr',
                relationship_label: 'Group',
                relationship_type: 'reference_outbound',
                field: 'group__sys',
                object: {
                    name: 'group__sys',
                },
            },
            {
                relationship_name: 'document__sysr',
                relationship_label: 'Document',
                relationship_type: 'reference_outbound',
                field: 'document__sysr',
                excludeIdField: true, // Don't want an ID field since documents is already a primary field
                object: {
                    name: 'documents',
                },
            },
        ],
    };

    const documentRelationshipsQueryTarget = {
        queryTarget: 'relationships',
        label: 'Document Relationships',
        fields: [
            {
                field: 'id',
                label: 'Relationship ID',
                fieldType: 'ID',
            },
            {
                field: 'source_doc_id__v',
                label: 'Source Document ID',
                fieldType: 'ID',
            },
            {
                field: 'source_major_version__v',
                label: 'Source Document Major Version',
                fieldType: 'String',
            },
            {
                field: 'source_minor_version__v',
                label: 'Source Document Minor Version',
                fieldType: 'String',
            },
            {
                field: 'target_doc_id__v',
                label: 'Target Document ID',
                fieldType: 'ID',
            },
            {
                field: 'target_major_version__v',
                label: 'Target Document Major Version',
                fieldType: 'String',
            },
            {
                field: 'target_minor_version__v',
                label: 'Target Document Minor Version',
                fieldType: 'String',
            },
            {
                field: 'relationship_type__v',
                label: 'Relationship Type',
                fieldType: 'String',
            },
            {
                field: 'created_date__v',
                label: 'Created Date',
                fieldType: 'DateTime',
            },
            {
                field: 'created_by__v',
                label: 'Created By',
                fieldType: 'ID',
            },
            {
                field: 'source_vault_id__v',
                label: 'Source Vault ID',
                fieldType: 'ID',
            },
        ],
        // Relationships modeled after Retrieve Object Metadata response so utility functions can be shared
        relationships: [
            {
                relationship_name: 'source__vr',
                relationship_label: 'Source Document',
                relationship_type: 'reference_outbound',
                excludeIdField: true,
                object: {
                    name: 'documents',
                },
            },
            {
                relationship_name: 'target__vr',
                relationship_label: 'Target Document',
                relationship_type: 'reference_outbound',
                excludeIdField: true,
                object: {
                    name: 'documents',
                },
            },
        ],
    };

    const renditionsQueryTarget = {
        queryTarget: 'renditions',
        subQueryTarget: 'renditions__sysr',
        label: 'Renditions',
        fields: [
            {
                field: 'document_id',
                label: 'Document ID',
                fieldType: 'ID',
            },
            {
                field: 'rendition_type__sys',
                label: 'Rendition Type',
                fieldType: 'String',
            },
            {
                field: 'major_version_number__sys',
                label: 'Major Version',
                fieldType: 'Number',
            },
            {
                field: 'minor_version_number__sys',
                label: 'Minor Version',
                fieldType: 'Number',
            },
            {
                field: 'size__sys',
                label: 'Size',
                fieldType: 'Number',
            },
            {
                field: 'md5checksum__sys',
                label: 'MD5 Checksum',
                fieldType: 'String',
            },
            {
                field: 'filename__sys',
                label: 'File Name',
                fieldType: 'String',
            },
            {
                field: 'pending__sys',
                label: 'Pending',
                fieldType: 'Boolean',
            },
            {
                field: 'format__sys',
                label: 'Format',
                fieldType: 'String',
            },
            {
                field: 'upload_date__sys',
                label: 'Minor Version',
                fieldType: 'Date',
            },
            {
                field: 'document_version_id',
                label: 'Version ID',
                fieldType: 'String',
            },
        ],
        relationships: [],
    };

    const bindersQueryTarget = {
        queryTarget: 'binders',
        label: 'Binders',
        fields: [], // Retrieved dynamically via REST API (they are same as document fields)
        // Relationships modeled after Retrieve Object Metadata response so utility functions can be shared
        relationships: [
            {
                relationship_name: 'binder_nodes__sysr',
                relationship_label: 'Binder Nodes',
                relationship_type: 'reference_inbound',
                object: {
                    name: 'documents',
                },
            },
        ],
    };

    const binderNodesQueryTarget = {
        queryTarget: 'binder_node__sys',
        label: 'Binder Nodes',
        fields: [
            {
                field: 'id',
                label: 'Node ID',
                fieldType: 'ID',
            },
            {
                field: 'name__v',
                label: 'Name',
                fieldType: 'String',
            },
            {
                field: 'parent_binder_id__sys',
                label: 'Parent Binder ID',
                fieldType: 'ID',
            },
            {
                field: 'parent_binder_major_version__sys',
                label: 'Parent Binder Major Version',
                fieldType: 'String',
            },
            {
                field: 'parent_binder_minor_version__sys',
                label: 'Parent Binder Minor Version',
                fieldType: 'String',
            },
            {
                field: 'parent_node_id__sys',
                label: 'Parent Node ID',
                fieldType: 'ID',
            },
            {
                field: 'section_id__sys',
                label: 'Section ID',
                fieldType: 'ID',
            },
            {
                field: 'parent_section_id__sys',
                label: 'Parent Section ID',
                fieldType: 'ID',
            },
            {
                field: 'order__sys',
                label: 'Order',
                fieldType: 'Number',
            },
            {
                field: 'content_id__sys',
                label: 'Content ID',
                fieldType: 'ID',
            },
            {
                field: 'content_major_version__sys',
                label: 'Content Major Version',
                fieldType: 'String',
            },
            {
                field: 'content_minor_version__sys',
                label: 'Content Minor Version',
                fieldType: 'String',
            },
            {
                field: 'type__sys',
                label: 'Type',
                fieldType: 'Picklist',
            },
            {
                field: 'created_date__v',
                label: 'Created Date',
                fieldType: 'DateTime',
            },
            {
                field: 'created_by__v',
                label: 'Created By',
                fieldType: 'ID',
            },
            {
                field: 'modified_date__v',
                label: 'Modified Date',
                fieldType: 'DateTime',
            },
            {
                field: 'modified_by__v',
                label: 'Modified By',
                fieldType: 'ID',
            },
        ],
        // Relationships modeled after Retrieve Object Metadata response so utility functions can be shared
        relationships: [
            {
                relationship_name: 'binder__sysr',
                relationship_label: 'Binder',
                relationship_type: 'parent',
                excludeIdField: true,
                object: {
                    name: 'documents',
                },
            },
            {
                relationship_name: 'document__sysr',
                relationship_label: 'Document',
                relationship_type: 'reference_outbound',
                excludeIdField: true,
                object: {
                    name: 'documents',
                },
            },
            {
                relationship_name: 'child_nodes__sysr',
                relationship_label: 'Child Nodes',
                relationship_type: 'child',
                excludeIdField: true,
            },
            {
                relationship_name: 'parent_node__sysr',
                relationship_label: 'Parent Nodes',
                relationship_type: 'parent',
                excludeIdField: true,
            },
        ],
    };

    const documentSignaturesQueryTarget = {
        queryTarget: 'document_signature__sysr',
        subQueryTarget: 'document_signature__sysr',
        label: 'Document Signatures',
        fields: [], // Retrieved dynamically via REST API
    };

    const jobInstancesQueryTarget = {
        queryTarget: 'job_instance__sys',
        label: 'Job Instances',
        fields: [
            {
                field: 'id',
                label: 'Job ID',
                fieldType: 'ID',
            },
            {
                field: 'job_name__sys',
                label: 'Job Name',
                fieldType: 'String',
            },
            {
                field: 'job_metadata__sys',
                label: 'Job Metadata',
                fieldType: 'String',
            },
            {
                field: 'job_type__sys',
                label: 'Job Type',
                fieldType: 'String',
            },
            {
                field: 'job_title__sys',
                label: 'Job Title',
                fieldType: 'String',
            },
            {
                field: 'status__sys',
                label: 'Job Status',
                fieldType: 'String',
            },
            {
                field: 'created_by__sys',
                label: 'Created By',
                fieldType: 'ID',
            },
            {
                field: 'queue_date__sys',
                label: 'Queue Date',
                fieldType: 'DateTime',
            },
            {
                field: 'run_date__sys',
                label: 'Run Date',
                fieldType: 'DateTime',
            },
        ],
        relationships: [],
    };

    const jobHistoriesQueryTarget = {
        queryTarget: 'job_history__sys',
        label: 'Job Histories',
        fields: [
            {
                field: 'id',
                label: 'Job ID',
                fieldType: 'ID',
            },
            {
                field: 'job_name__sys',
                label: 'Job Name',
                fieldType: 'String',
            },
            {
                field: 'job_metadata__sys',
                label: 'Job Metadata',
                fieldType: 'String',
            },
            {
                field: 'job_type__sys',
                label: 'Job Type',
                fieldType: 'String',
            },
            {
                field: 'job_title__sys',
                label: 'Job Title',
                fieldType: 'String',
            },
            {
                field: 'status__sys',
                label: 'Job Status',
                fieldType: 'String',
            },
            {
                field: 'schedule_date__sys',
                label: 'Schedule Date',
                fieldType: 'DateTime',
            },
            {
                field: 'queue_date__sys',
                label: 'Queue Date',
                fieldType: 'DateTime',
            },
            {
                field: 'start_date__sys',
                label: 'Start Date',
                fieldType: 'DateTime',
            },
            {
                field: 'finish_date__sys',
                label: 'Finish Date',
                fieldType: 'DateTime',
            },
        ],
        relationships: [
            {
                relationship_name: 'job_task_history__sysr',
                relationship_label: 'Job Task Histories',
                relationship_type: 'reference_inbound',
            },
        ],
    };

    const jobTaskHistoriesQueryTarget = {
        queryTarget: 'job_task_history__sys',
        label: 'Job Task Histories',
        fields: [
            {
                field: 'task_id__sys',
                label: 'Task ID',
                fieldType: 'ID',
            },
            {
                field: 'job_history__sys',
                label: 'Job History ID',
                fieldType: 'ID',
            },
            {
                field: 'status__sys',
                label: 'Job Status',
                fieldType: 'String',
            },
            {
                field: 'queue_date__sys',
                label: 'Queue Date',
                fieldType: 'DateTime',
            },
            {
                field: 'finish_date__sys',
                label: 'Finish Date',
                fieldType: 'DateTime',
            },
        ],
        relationships: [
            {
                relationship_name: 'job_history__sysr',
                relationship_label: 'Job History',
                relationship_type: 'reference_outbound',
                excludeIdField: true,
            },
        ],
    };

    const groupsQueryTarget = {
        queryTarget: 'group__sys',
        label: 'Groups',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'name__v',
                label: 'Name',
                fieldType: 'String',
            },
            {
                field: 'label__v',
                label: 'Label',
                fieldType: 'String',
            },
            {
                field: 'status__v',
                label: 'Status',
                fieldType: 'Picklist',
                picklist: 'default_status__v',
            },
            {
                field: 'description__sys',
                label: 'Description',
                fieldType: 'String',
            },
            {
                field: 'system_group__sys',
                label: 'System Group',
                fieldType: 'Boolean',
            },
            {
                field: 'type__sys',
                label: 'Type',
                fieldType: 'Picklist',
                picklist: 'group_types__sys',
            },
            {
                field: 'created_date__v',
                label: 'Created Date',
                fieldType: 'DateTime',
            },
            {
                field: 'created_by__v',
                label: 'Created By',
                fieldType: 'ID',
            },
            {
                field: 'modified_date__v',
                label: 'Modified Date',
                fieldType: 'DateTime',
            },
            {
                field: 'modified_by__v',
                label: 'Modified By',
                fieldType: 'ID',
            },
        ],
        relationships: [
            {
                relationship_name: 'group_membership__sysr',
                relationship_label: 'Group Membership',
                relationship_type: 'reference_inbound',
                excludeIdField: true,
            },
        ],
    };

    const groupMembershipQueryTarget = {
        queryTarget: 'group_membership__sys',
        label: 'Group Membership',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'user_id__sys',
                label: 'User ID',
                fieldType: 'ID',
            },
            {
                field: 'group_id__sys',
                label: 'Group ID',
                fieldType: 'ID',
            },
        ],
        relationships: [
            {
                relationship_name: 'user__sysr',
                relationship_label: 'User',
                relationship_type: 'reference_outbound',
                excludeIdField: true,
                object: {
                    name: 'user__sys',
                },
            },
            {
                relationship_name: 'group__sysr',
                relationship_label: 'Group',
                relationship_type: 'reference_outbound',
                excludeIdField: true,
            },
        ],
    };

    const activeWorkflowsQueryTarget = {
        queryTarget: 'active_workflow__sys',
        label: 'Active Workflows',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'label__sys',
                label: 'Label',
                fieldType: 'String',
            },
            {
                field: 'name__sys',
                label: 'Name',
                fieldType: 'String',
            },
            {
                field: 'owner__sys',
                label: 'Owner',
                fieldType: 'Object',
            },
            {
                field: 'cardinality__sys',
                label: 'Cardinality',
                fieldType: 'Picklist',
                picklist: 'workflow_cardinality__sys',
            },
            {
                field: 'type__sys',
                label: 'Type',
                fieldType: 'Picklist',
                picklist: 'workflow_type__sys',
            },
            {
                field: 'status__sys',
                label: 'Status',
                fieldType: 'Picklist',
                picklist: 'workflow_status__sys',
            },
            {
                field: 'workflow_definition_version__sys',
                label: 'Workflow Definition Version',
                fieldType: 'String',
            },
            {
                field: 'due_date__sys',
                label: 'Due Date',
                fieldType: 'DateTime',
            },
            {
                field: 'cancelled_date__sys',
                label: 'Cancelled Date',
                fieldType: 'DateTime',
            },
            {
                field: 'cancellation_comment__sys',
                label: 'Cancellation Comment',
                fieldType: 'String',
            },
            {
                field: 'completed_date__sys',
                label: 'Completed Date',
                fieldType: 'DateTime',
            },
            {
                field: 'created_by__sys',
                label: 'Created By',
                fieldType: 'ID',
            },
            {
                field: 'created_date__sys',
                label: 'Created Date',
                fieldType: 'DateTime',
            },
            {
                field: 'modified_date__sys',
                label: 'Modified Date',
                fieldType: 'DateTime',
            },
            {
                field: 'modified_by__sys',
                label: 'Modified By',
                fieldType: 'ID',
            },
            {
                field: 'class__sys',
                label: 'Class',
                fieldType: 'String',
            },
        ],
        relationships: [
            {
                relationship_name: 'owner__sysr',
                relationship_label: 'User',
                relationship_type: 'reference_outbound',
                field: 'owner__sys',
                object: {
                    name: 'user__sys',
                },
            },
            {
                relationship_name: 'active_workflow_tasks__sysr',
                relationship_label: 'Active Workflow Tasks',
                relationship_type: 'reference_inbound',
                relationship_query_target: 'active_workflow_task__sys',
            },
            {
                relationship_name: 'active_workflow_task_items__sysr',
                relationship_label: 'Active Workflow Task Items',
                relationship_type: 'reference_inbound',
                relationship_query_target: 'active_workflow_task_item__sys',
            },
        ],
    };

    const inactiveWorkflowsQueryTarget = {
        queryTarget: 'inactive_workflow__sys',
        label: 'Inactive Workflows',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'label__sys',
                label: 'Label',
                fieldType: 'String',
            },
            {
                field: 'name__sys',
                label: 'Name',
                fieldType: 'String',
            },
            {
                field: 'owner__sys',
                label: 'Owner',
                fieldType: 'Object',
            },
            {
                field: 'cardinality__sys',
                label: 'Cardinality',
                fieldType: 'Picklist',
                picklist: 'workflow_cardinality__sys',
            },
            {
                field: 'type__sys',
                label: 'Type',
                fieldType: 'Picklist',
                picklist: 'workflow_type__sys',
            },
            {
                field: 'status__sys',
                label: 'Status',
                fieldType: 'Picklist',
                picklist: 'workflow_status__sys',
            },
            {
                field: 'workflow_definition_version__sys',
                label: 'Workflow Definition Version',
                fieldType: 'String',
            },
            {
                field: 'due_date__sys',
                label: 'Due Date',
                fieldType: 'DateTime',
            },
            {
                field: 'cancelled_date__sys',
                label: 'Cancelled Date',
                fieldType: 'DateTime',
            },
            {
                field: 'cancellation_comment__sys',
                label: 'Cancellation Comment',
                fieldType: 'String',
            },
            {
                field: 'completed_date__sys',
                label: 'Completed Date',
                fieldType: 'DateTime',
            },
            {
                field: 'created_by__sys',
                label: 'Created By',
                fieldType: 'ID',
            },
            {
                field: 'created_date__sys',
                label: 'Created Date',
                fieldType: 'DateTime',
            },
            {
                field: 'modified_date__sys',
                label: 'Modified Date',
                fieldType: 'DateTime',
            },
            {
                field: 'modified_by__sys',
                label: 'Modified By',
                fieldType: 'ID',
            },
            {
                field: 'class__sys',
                label: 'Class',
                fieldType: 'String',
            },
        ],
        relationships: [
            {
                relationship_name: 'owner__sysr',
                relationship_label: 'User',
                relationship_type: 'reference_outbound',
                field: 'owner__sys',
                object: {
                    name: 'user__sys',
                },
            },
            {
                relationship_name: 'inactive_workflow_tasks__sysr',
                relationship_label: 'Inactive Workflow Tasks',
                relationship_type: 'reference_inbound',
                relationship_query_target: 'inactive_workflow_task__sys',
            },
            {
                relationship_name: 'inactive_workflow_task_items__sysr',
                relationship_label: 'Inactive Workflow Task Items',
                relationship_type: 'reference_inbound',
                relationship_query_target: 'inactive_workflow_task_item__sys',
            },
        ],
    };

    const activeWorkflowItemsQueryTarget = {
        queryTarget: 'active_workflow_item__sys',
        label: 'Active Workflow Items',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'workflow__sys',
                label: 'Parent Workflow',
                fieldType: 'String',
            },
            {
                field: 'type__sys',
                label: 'Type',
                fieldType: 'Picklist',
                picklist: 'workflow_item_type__sys',
            },
            {
                field: 'document__sys',
                label: 'Document ID',
                fieldType: 'ID',
            },
            {
                field: 'document_version__sys',
                label: 'Document Version',
                fieldType: 'String',
            },
            {
                field: 'object_name__sys',
                label: 'Object Record Name',
                fieldType: 'String',
            },
            {
                field: 'object_record_id__sys',
                label: 'Object Record ID',
                fieldType: 'ID',
            },
        ],
        relationships: [
            {
                relationship_name: 'active_workflow__sysr',
                relationship_label: 'Active Parent Workflow Instance',
                relationship_type: 'reference_outbound',
                relationship_query_target: 'active_workflow__sys',
            },
        ],
    };

    const inactiveWorkflowItemsQueryTarget = {
        queryTarget: 'inactive_workflow_item__sys',
        label: 'Inactive Workflow Items',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'workflow__sys',
                label: 'Parent Workflow',
                fieldType: 'String',
            },
            {
                field: 'type__sys',
                label: 'Type',
                fieldType: 'Picklist',
                picklist: 'workflow_item_type__sys',
            },
            {
                field: 'document__sys',
                label: 'Document ID',
                fieldType: 'ID',
            },
            {
                field: 'document_version__sys',
                label: 'Document Version',
                fieldType: 'String',
            },
            {
                field: 'object_name__sys',
                label: 'Object Record Name',
                fieldType: 'String',
            },
            {
                field: 'object_record_id__sys',
                label: 'Object Record ID',
                fieldType: 'ID',
            },
        ],
        relationships: [
            {
                relationship_name: 'inactive_workflow__sysr',
                relationship_label: 'Inactive Parent Workflow Instance',
                relationship_type: 'reference_outbound',
                relationship_query_target: 'inactive_workflow__sys',
            },
        ],
    };

    const activeWorkflowTasksQueryTarget = {
        queryTarget: 'active_workflow_task__sys',
        label: 'Active Workflow Tasks',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'workflow__sys',
                label: 'Parent Workflow',
                fieldType: 'String',
            },
            {
                field: 'label__sys',
                label: 'Label',
                fieldType: 'String',
            },
            {
                field: 'name__sys',
                label: 'Name',
                fieldType: 'String',
            },
            {
                field: 'owner__sys',
                label: 'Owner',
                fieldType: 'Object',
            },
            {
                field: 'participant_group__sys',
                label: 'Participant Group',
                fieldType: 'String',
            },
            {
                field: 'status__sys',
                label: 'Status',
                fieldType: 'Picklist',
                picklist: 'workflow_task_status__sys',
            },
            {
                field: 'assigned_date__sys',
                label: 'Assigned Date',
                fieldType: 'DateTime',
            },
            {
                field: 'cancelled_date__sys',
                label: 'Cancelled Date',
                fieldType: 'DateTime',
            },
            {
                field: 'completed_by__sys',
                label: 'Completed By',
                fieldType: 'ID',
            },
            {
                field: 'created_date__sys',
                label: 'Created Date',
                fieldType: 'DateTime',
            },
            {
                field: 'due_date__sys',
                label: 'Due Date',
                fieldType: 'DateTime',
            },
            {
                field: 'modified_date__sys',
                label: 'Modified Date',
                fieldType: 'DateTime',
            },
            {
                field: 'completed_date__sys',
                label: 'Completed Date',
                fieldType: 'DateTime',
            },
            {
                field: 'iteration__sys',
                label: 'Iterations',
                fieldType: 'Number',
            },
            {
                field: 'instructions__sys',
                label: 'Instructions',
                fieldType: 'String',
            },
            {
                field: 'group_instructions__sys',
                label: 'Group Instructions',
                fieldType: 'String',
            },
        ],
        relationships: [
            {
                relationship_name: 'owner__sysr',
                relationship_label: 'User',
                relationship_type: 'reference_outbound',
                field: 'owner__sys',
                object: {
                    name: 'user__sys',
                },
            },
            {
                relationship_name: 'active_workflow__sysr',
                relationship_label: 'Active Parent Workflow Instance',
                relationship_type: 'reference_outbound',
                relationship_query_target: 'active_workflow__sys',
            },
            {
                relationship_name: 'active_workflow_task_items__sysr',
                relationship_label: 'Active Workflow Task Items',
                relationship_type: 'reference_inbound',
                relationship_query_target: 'active_workflow_task_item__sys',
            },
        ],
    };

    const inactiveWorkflowTasksQueryTarget = {
        queryTarget: 'inactive_workflow_task__sys',
        label: 'Inactive Workflow Tasks',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'workflow__sys',
                label: 'Parent Workflow',
                fieldType: 'String',
            },
            {
                field: 'label__sys',
                label: 'Label',
                fieldType: 'String',
            },
            {
                field: 'name__sys',
                label: 'Name',
                fieldType: 'String',
            },
            {
                field: 'owner__sys',
                label: 'Owner',
                fieldType: 'Object',
            },
            {
                field: 'participant_group__sys',
                label: 'Participant Group',
                fieldType: 'String',
            },
            {
                field: 'status__sys',
                label: 'Status',
                fieldType: 'Picklist',
                picklist: 'workflow_task_status__sys',
            },
            {
                field: 'assigned_date__sys',
                label: 'Assigned Date',
                fieldType: 'DateTime',
            },
            {
                field: 'cancelled_date__sys',
                label: 'Cancelled Date',
                fieldType: 'DateTime',
            },
            {
                field: 'completed_by__sys',
                label: 'Completed By',
                fieldType: 'ID',
            },
            {
                field: 'created_date__sys',
                label: 'Created Date',
                fieldType: 'DateTime',
            },
            {
                field: 'due_date__sys',
                label: 'Due Date',
                fieldType: 'DateTime',
            },
            {
                field: 'modified_date__sys',
                label: 'Modified Date',
                fieldType: 'DateTime',
            },
            {
                field: 'completed_date__sys',
                label: 'Completed Date',
                fieldType: 'DateTime',
            },
            {
                field: 'iteration__sys',
                label: 'Iterations',
                fieldType: 'Number',
            },
            {
                field: 'instructions__sys',
                label: 'Instructions',
                fieldType: 'String',
            },
            {
                field: 'group_instructions__sys',
                label: 'Group Instructions',
                fieldType: 'String',
            },
        ],
        relationships: [
            {
                relationship_name: 'owner__sysr',
                relationship_label: 'User',
                relationship_type: 'reference_outbound',
                field: 'owner__sys',
                object: {
                    name: 'user__sys',
                },
            },
            {
                relationship_name: 'inactive_workflow__sysr',
                relationship_label: 'Inactive Parent Workflow Instance',
                relationship_type: 'reference_outbound',
                relationship_query_target: 'inactive_workflow__sys',
            },
            {
                relationship_name: 'inactive_workflow_task_items__sysr',
                relationship_label: 'Inactive Workflow Task Items',
                relationship_type: 'reference_inbound',
                relationship_query_target: 'inactive_workflow_task_item__sys',
            },
        ],
    };

    const activeWorkflowTaskItemsQueryTarget = {
        queryTarget: 'active_workflow_task_item__sys',
        label: 'Active Workflow Task Items',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'task__sys',
                label: 'Parent Task',
                fieldType: 'ID',
            },
            {
                field: 'task_comment__sys',
                label: 'Task Comment',
                fieldType: 'String',
            },
            {
                field: 'workflow__sys',
                label: 'Parent Workflow',
                fieldType: 'String',
            },
            {
                field: 'status__sys',
                label: 'Status',
                fieldType: 'Picklist',
                picklist: 'workflow_task_item_status__sys',
            },
            {
                field: 'capacity__sys',
                label: 'Capacity',
                fieldType: 'String',
            },
            {
                field: 'verdict__sys',
                label: 'Verdict',
                fieldType: 'String',
            },
            {
                field: 'verdict_reason__sys',
                label: 'Verdict Reason',
                fieldType: 'String',
            },
            {
                field: 'verdict_comment__sys',
                label: 'Verdict Comment',
                fieldType: 'String',
            },
            {
                field: 'type__sys',
                label: 'Type',
                fieldType: 'Picklist',
                picklist: 'workflow_item_type__sys',
            },
            {
                field: 'document_id__sys',
                label: 'Document ID',
                fieldType: 'Number',
            },
            {
                field: 'verdict_document_major_version_number__sys',
                label: 'Document Major Version',
                fieldType: 'String',
            },
            {
                field: 'verdict_document_minor_version_number__sys',
                label: 'Document Minor Version',
                fieldType: 'String',
            },
            {
                field: 'verdict_document_version_id__sys',
                label: 'Document Version ID',
                fieldType: 'String',
            },
            {
                field: 'object__sys',
                label: 'Object Record Name',
                fieldType: 'String',
            },
            {
                field: 'object_record_id__sys',
                label: 'Object Record ID',
                fieldType: 'ID',
            },
        ],
        relationships: [
            {
                relationship_name: 'active_workflow__sysr',
                relationship_label: 'Active Parent Workflow Instance',
                relationship_type: 'reference_outbound',
                relationship_query_target: 'active_workflow__sys',
            },
            {
                relationship_name: 'active_workflow_task__sysr',
                relationship_label: 'Active Parent Task Instance',
                relationship_type: 'reference_outbound',
                relationship_query_target: 'active_workflow_task__sys',
            },
        ],
    };

    const inactiveWorkflowTaskItemsQueryTarget = {
        queryTarget: 'inactive_workflow_task_item__sys',
        label: 'Active Workflow Task Items',
        fields: [
            {
                field: 'id',
                label: 'ID',
                fieldType: 'ID',
            },
            {
                field: 'task__sys',
                label: 'Parent Task',
                fieldType: 'ID',
            },
            {
                field: 'task_comment__sys',
                label: 'Task Comment',
                fieldType: 'String',
            },
            {
                field: 'workflow__sys',
                label: 'Parent Workflow',
                fieldType: 'String',
            },
            {
                field: 'status__sys',
                label: 'Status',
                fieldType: 'Picklist',
                picklist: 'workflow_task_item_status__sys',
            },
            {
                field: 'capacity__sys',
                label: 'Capacity',
                fieldType: 'String',
            },
            {
                field: 'verdict__sys',
                label: 'Verdict',
                fieldType: 'String',
            },
            {
                field: 'verdict_reason__sys',
                label: 'Verdict Reason',
                fieldType: 'String',
            },
            {
                field: 'verdict_comment__sys',
                label: 'Verdict Comment',
                fieldType: 'String',
            },
            {
                field: 'type__sys',
                label: 'Type',
                fieldType: 'Picklist',
                picklist: 'workflow_item_type__sys',
            },
            {
                field: 'document_id__sys',
                label: 'Document ID',
                fieldType: 'Number',
            },
            {
                field: 'verdict_document_major_version_number__sys',
                label: 'Document Major Version',
                fieldType: 'String',
            },
            {
                field: 'verdict_document_minor_version_number__sys',
                label: 'Document Minor Version',
                fieldType: 'String',
            },
            {
                field: 'verdict_document_version_id__sys',
                label: 'Document Version ID',
                fieldType: 'String',
            },
            {
                field: 'object__sys',
                label: 'Object Record Name',
                fieldType: 'String',
            },
            {
                field: 'object_record_id__sys',
                label: 'Object Record ID',
                fieldType: 'ID',
            },
        ],
        relationships: [
            {
                relationship_name: 'inactive_workflow__sysr',
                relationship_label: 'Inactive Parent Workflow Instance',
                relationship_type: 'reference_outbound',
                relationship_query_target: 'inactive_workflow__sys',
            },
            {
                relationship_name: 'inactive_workflow_task__sysr',
                relationship_label: 'Inactive Parent Task Instance',
                relationship_type: 'reference_outbound',
                relationship_query_target: 'inactive_workflow_task__sys',
            },
        ],
    };

    const documentsQueryTarget = {
        queryTarget: 'documents',
        fields: [], // Retrieved dynamically via REST API
        relationships: [], // Most documents relationships are retrieved dynamically via REST API
        subqueries: { documentRolesQueryTarget, documentSignaturesQueryTarget, renditionsQueryTarget }, // A few relationship subqueries must be hard-coded
    };

    const usersQueryTarget = {
        queryTarget: 'users',
        label: 'Users',
        fields: [], // Retrieved dynamically via REST API
        relationships: [], // Retrieved dynamically via REST API
    };

    const queryCategories = [
        'Objects',
        'Documents',
        'Document Roles',
        'Document Relationships',
        'Matched Documents',
        'Binders',
        'Users',
        'Renditions',
        'Jobs',
        'Groups',
        'Workflows',
    ];

    const queryTargets = {
        Objects: [], // Object query targets are retrieved dynamically via the REST API
        Documents: [
            { name: 'documents', label: 'Documents', metadata: documentsQueryTarget },
            { name: 'archived_documents', label: 'Archived Documents', metadata: documentsQueryTarget },
        ],
        'Document Roles': [{ name: 'doc_role__sys', label: 'Document Roles', metadata: documentRolesQueryTarget }],
        'Document Relationships': [
            { name: 'relationships', label: 'Document Relationships', metadata: documentRelationshipsQueryTarget },
        ],
        Binders: [
            { name: 'binders', label: 'Binders', metadata: bindersQueryTarget },
            { name: 'binder_node__sys', label: 'Binder Nodes', metadata: binderNodesQueryTarget },
        ],
        Users: [{ name: 'users', label: 'Users', metadata: usersQueryTarget }],
        Renditions: [{ name: 'renditions', label: 'Renditions', metadata: renditionsQueryTarget }],
        'Matched Documents': [
            { name: 'matched_documents', label: 'Matched Documents', metadata: matchedDocumentsQueryTarget },
        ],
        Jobs: [
            { name: 'job_instance__sys', label: 'Job Instances', metadata: jobInstancesQueryTarget },
            { name: 'job_history__sys', label: 'Job Histories', metadata: jobHistoriesQueryTarget },
            { name: 'job_task_history__sys', label: 'Job Task Histories', metadata: jobTaskHistoriesQueryTarget },
        ],
        Groups: [
            { name: 'group__sys', label: 'Groups', metadata: groupsQueryTarget },
            { name: 'group_membership__sys', label: 'Group Memberships', metadata: groupMembershipQueryTarget },
        ],
        Workflows: [
            { name: 'active_workflow__sys', label: 'Active Workflows', metadata: activeWorkflowsQueryTarget },
            { name: 'inactive_workflow__sys', label: 'Inactive Workflows', metadata: inactiveWorkflowsQueryTarget },
            {
                name: 'active_workflow_item__sys',
                label: 'Active Workflow Items',
                metadata: activeWorkflowItemsQueryTarget,
            },
            {
                name: 'inactive_workflow_item__sys',
                label: 'Inactive Workflow Items',
                metadata: inactiveWorkflowItemsQueryTarget,
            },
            {
                name: 'active_workflow_task__sys',
                label: 'Active Workflow Tasks',
                metadata: activeWorkflowTasksQueryTarget,
            },
            {
                name: 'inactive_workflow_task__sys',
                label: 'Inactive Workflow Tasks',
                metadata: inactiveWorkflowTasksQueryTarget,
            },
            {
                name: 'active_workflow_task_item__sys',
                label: 'Active Workflow Task Items',
                metadata: activeWorkflowTaskItemsQueryTarget,
            },
            {
                name: 'inactive_workflow_task_item__sys',
                label: 'Inactive Workflow Task Items',
                metadata: inactiveWorkflowTaskItemsQueryTarget,
            },
        ],
    };

    return {
        queryCategories,
        queryTargets,
        supportedQueryFilterOperators,
        booleanValues,
        attachmentsQueryTarget,
    };
}
