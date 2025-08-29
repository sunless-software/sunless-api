DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('ACTIVE', 'INACTIVE', 'PAUSED', 'FINISHED', 'DRAFT', 'DISCARDED', 'CANCELED');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'permission_scope') THEN
        CREATE TYPE permission_scope AS ENUM ('GLOBAL', 'PROJECT');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'external_resource_type') THEN
        CREATE TYPE external_resource_type AS ENUM (
            'GITHUB',
            'BITBUCKET',
            'OTHER_REPO',
            'JIRA',
            'TRELLO',
            'CONFLUENCE',
            'DRIVE',
            'OTHER'
        );
    END IF;
END
$$;