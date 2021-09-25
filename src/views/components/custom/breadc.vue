<template>
    <div class="row page-titles">
        <div class="col-md-5 align-self-center">
            <h4 class="text-themecolor">{{name}}s</h4>
        </div>
        <div class="col-md-7 align-self-center text-right">
            <div class="d-flex justify-content-end align-items-center">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="javascript:void(0)">{{name}}s</a></li>
                    <li class="breadcrumb-item active">{{ope}}</li>
                </ol>
                <a v-if="showbtn" :href="crlink" class="btn btn-info d-none d-lg-block ml-5" >
                    <i class="fa fa-plus-circle"></i> Nouveau {{name}}
                </a>
                <a v-if="archLink && !showArchive" :href="archLink" class="btn btn-danger d-none d-lg-block m-l-15" >
                    <i class="ti-archive"></i> Archive
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ["name","crlink", "ope", 'showbtn', 'archLink', 'showArchive'],
    }
</script>
